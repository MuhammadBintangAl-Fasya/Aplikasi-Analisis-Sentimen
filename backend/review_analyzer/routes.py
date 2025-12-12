def includeme(config):
    """Add routes to the configuration."""
    
    # Root endpoint
    config.add_route('home', '/')
    
    # Health check endpoint
    config.add_route('health', '/api/health')
    
    # Review API endpoints
    config.add_route('analyze_review', '/api/analyze-review', request_method='POST')
    config.add_route('get_reviews', '/api/reviews', request_method='GET')
    config.add_route('get_review', '/api/reviews/{id}', request_method='GET')
    config.add_route('delete_review', '/api/reviews/{id}', request_method='DELETE')
