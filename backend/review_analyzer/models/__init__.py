from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import configure_mappers
import zope.sqlalchemy

# Import model agar ter-register di metadata
from .meta import Base
from .review import Review  # Penting: import model di sini

def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)

def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory

def get_tm_session(session_factory, transaction_manager):
    """
    Membuat session SQLA yang terikat dengan Zope Transaction Manager.
    Ini kunci agar pyramid_tm bekerja.
    """
    dbsession = session_factory()
    zope.sqlalchemy.register(
        dbsession, transaction_manager=transaction_manager)
    return dbsession

def includeme(config):
    """
    Fungsi ini dipanggil oleh config.include('.models') di __init__.py utama
    """
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    # Setup DB listeners
    configure_mappers()

    # Buat Engine & Session Factory
    engine = get_engine(settings)
    session_factory = get_session_factory(engine)

    # Simpan di registry agar bisa diakses global jika perlu
    config.registry['dbsession_factory'] = session_factory

    # Buat request method: request.dbsession
    # Setiap kali kamu panggil request.dbsession di view, fungsi ini jalan.
    config.add_request_method(
        lambda r: get_tm_session(session_factory, r.tm),
        'dbsession',
        reify=True
    )