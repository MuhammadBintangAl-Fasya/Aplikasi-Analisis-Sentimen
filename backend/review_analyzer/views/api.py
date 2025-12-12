import asyncio
from pyramid.view import view_config
from pyramid.response import Response
from ..models import Review
from ..services.ai_services import analyze_sentiment, extract_key_points


def add_cors_headers(request, response):
    """Add CORS headers to response."""
    origins = request.registry.settings.get('cors.origins', '*')
    response.headers.update({
        'Access-Control-Allow-Origin': origins,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    })
    return response


@view_config(route_name='home', renderer='json')
def home(request):
    """Root endpoint."""
    response = {
        'message': 'Product Review Analyzer API - Pyramid Backend',
        'version': '1.0.0',
        'endpoints': {
            'health': 'GET /api/health',
            'analyze': 'POST /api/analyze-review',
            'get_reviews': 'GET /api/reviews',
            'get_review': 'GET /api/reviews/{id}',
            'delete_review': 'DELETE /api/reviews/{id}',
        }
    }
    return add_cors_headers(request, Response(json_body=response))


@view_config(route_name='health', renderer='json')
def health_check(request):
    """Health check endpoint."""
    response = {
        'status': 'healthy',
        'database': 'connected',
        'ai_services': 'ready'
    }
    return add_cors_headers(request, Response(json_body=response))


@view_config(route_name='analyze_review', renderer='json', request_method='POST')
def analyze_review(request):
    """
    Analyze a product review using AI.
    
    Request body:
    {
        "product_name": "Product name",
        "review_text": "Review content"
    }
    """
    try:
        # Get JSON data from request
        json_data = request.json_body
        
        # Validate required fields
        if 'product_name' not in json_data or 'review_text' not in json_data:
            response = Response(
                json_body={'error': 'product_name and review_text are required'},
                status=400
            )
            return add_cors_headers(request, response)
        
        product_name = json_data['product_name'].strip()
        review_text = json_data['review_text'].strip()
        
        # Validate field lengths
        if len(product_name) < 1:
            response = Response(
                json_body={'error': 'product_name cannot be empty'},
                status=400
            )
            return add_cors_headers(request, response)
        
        if len(review_text) < 10:
            response = Response(
                json_body={'error': 'review_text must be at least 10 characters'},
                status=400
            )
            return add_cors_headers(request, response)
        
        # Run async AI analysis
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Step 1: Analyze sentiment
        print(f"🔍 Analyzing sentiment for: {product_name}")
        sentiment_result = loop.run_until_complete(analyze_sentiment(review_text))
        
        # Step 2: Extract key points
        print(f"📝 Extracting key points...")
        key_points = loop.run_until_complete(extract_key_points(review_text, product_name))
        
        loop.close()
        
        # Step 3: Save to database
        dbsession = request.dbsession
        
        review = Review(
            product_name=product_name,
            review_text=review_text,
            sentiment=sentiment_result['sentiment'],
            sentiment_score=sentiment_result['score'],
            key_points=key_points
        )
        
        dbsession.add(review)
        dbsession.flush()  # Flush to get the ID
        
        print(f"✅ Review saved with ID: {review.id}")
        
        # Return response
        response_data = review.to_dict()
        response = Response(json_body=response_data, status=201)
        return add_cors_headers(request, response)
        
    except Exception as e:
        print(f"❌ Error analyzing review: {str(e)}")
        import traceback
        traceback.print_exc()
        
        response = Response(
            json_body={'error': f'Failed to analyze review: {str(e)}'},
            status=500
        )
        return add_cors_headers(request, response)


@view_config(route_name='get_reviews', renderer='json', request_method='GET')
def get_reviews(request):
    """
    Get all reviews with pagination.
    
    Query parameters:
    - limit: Maximum number of reviews to return (default: 50)
    - offset: Number of reviews to skip (default: 0)
    """
    try:
        # Get query parameters
        limit = int(request.params.get('limit', 50))
        offset = int(request.params.get('offset', 0))
        
        dbsession = request.dbsession
        
        # Get total count
        total = dbsession.query(Review).count()
        
        # Get reviews with pagination
        reviews = dbsession.query(Review)\
            .order_by(Review.created_at.desc())\
            .limit(limit)\
            .offset(offset)\
            .all()
        
        # Convert to dict
        review_dicts = [review.to_dict() for review in reviews]
        
        response_data = {
            'reviews': review_dicts,
            'total': total
        }
        
        response = Response(json_body=response_data)
        return add_cors_headers(request, response)
        
    except Exception as e:
        print(f"❌ Error fetching reviews: {str(e)}")
        response = Response(
            json_body={'error': f'Failed to fetch reviews: {str(e)}'},
            status=500
        )
        return add_cors_headers(request, response)


@view_config(route_name='get_review', renderer='json', request_method='GET')
def get_review(request):
    """Get a single review by ID."""
    try:
        review_id = int(request.matchdict['id'])
        dbsession = request.dbsession
        
        review = dbsession.query(Review).filter(Review.id == review_id).first()
        
        if not review:
            response = Response(
                json_body={'error': 'Review not found'},
                status=404
            )
            return add_cors_headers(request, response)
        
        response = Response(json_body=review.to_dict())
        return add_cors_headers(request, response)
        
    except ValueError:
        response = Response(
            json_body={'error': 'Invalid review ID'},
            status=400
        )
        return add_cors_headers(request, response)
    except Exception as e:
        print(f"❌ Error fetching review: {str(e)}")
        response = Response(
            json_body={'error': f'Failed to fetch review: {str(e)}'},
            status=500
        )
        return add_cors_headers(request, response)


@view_config(route_name='delete_review', renderer='json', request_method='DELETE')
def delete_review(request):
    """Delete a review by ID."""
    try:
        review_id = int(request.matchdict['id'])
        dbsession = request.dbsession
        
        review = dbsession.query(Review).filter(Review.id == review_id).first()
        
        if not review:
            response = Response(
                json_body={'error': 'Review not found'},
                status=404
            )
            return add_cors_headers(request, response)
        
        dbsession.delete(review)
        
        response_data = {
            'success': True,
            'message': f'Review {review_id} deleted successfully'
        }
        
        response = Response(json_body=response_data)
        return add_cors_headers(request, response)
        
    except ValueError:
        response = Response(
            json_body={'error': 'Invalid review ID'},
            status=400
        )
        return add_cors_headers(request, response)
    except Exception as e:
        print(f"❌ Error deleting review: {str(e)}")
        response = Response(
            json_body={'error': f'Failed to delete review: {str(e)}'},
            status=500
        )
        return add_cors_headers(request, response)
