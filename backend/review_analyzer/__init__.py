import os
from pyramid.config import Configurator
from pyramid.events import NewRequest
from dotenv import load_dotenv

# Load env vars
load_dotenv()

def add_cors_headers_response_callback(event):
    """
    Fungsi ini dipanggil SETIAP kali ada request masuk.
    Dia menempelkan header CORS ke response sebelum dikirim balik.
    """
    def cors_headers(request, response):
        # Ambil origin dari env, atau default '*' (allow all)
        origin = os.getenv('CORS_ORIGINS', '*')
        
        response.headers.update({
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS,PATCH',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application. """
    
    # 1. Setup Database URL
    if os.getenv('DATABASE_URL'):
        settings['sqlalchemy.url'] = os.getenv('DATABASE_URL')

    with Configurator(settings=settings) as config:
        # --- Core Modules ---
        config.include('pyramid_tm')
        config.include('pyramid_retry')
        
        # --- MODEL & ROUTE ---
        config.include('.models')
        config.include('.routes')

        # --- MANUAL CORS SETUP (PASTI JALAN) ---
        # Kita daftarkan fungsi di atas agar jalan setiap ada request
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)
        # ---------------------------------------

        config.scan('.views')

    return config.make_wsgi_app()