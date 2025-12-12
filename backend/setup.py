import os
from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))

requires = [
    'pyramid==2.0.2',
    'pyramid-debugtoolbar==4.10',
    'waitress==2.1.2',
    'pyramid-tm==2.5',
    'pyramid-retry==2.1.1',
    'SQLAlchemy==2.0.23',
    'zope.sqlalchemy==3.1',
    'psycopg2-binary==2.9.9',
    'alembic==1.12.1',
    'python-dotenv==1.0.0',
    'aiohttp==3.9.1',
    'google-generativeai==0.3.1',
    'pyramid-default-cors',
]

tests_require = [
    'WebTest',
    'pytest',
    'pytest-cov',
]

setup(
    name='review_analyzer',
    version='1.0.0',
    description='Product Review Analyzer with AI',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='Your Name',
    author_email='your.email@example.com',
    url='https://github.com/yourusername/review-analyzer',
    keywords='web pyramid pylons ai review analyzer',
    packages=find_packages(exclude=['tests']),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        'testing': tests_require,
    },
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = review_analyzer:main',
        ],
    },
)
