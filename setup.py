from setuptools import setup, find_packages

setup(
    name="robotframework-dashboard",
    version="0.1",
    description="Output processor and dashboard generator for Robot Framework output files",
    long_description="Process output.xml files into a database using the Robot Framework result.api then generate a dashboard HTML with this data",
    classifiers=[
        "Framework :: Robot Framework",
        "Programming Language :: Python",
        "Topic :: Software Development :: Testing :: Test Automation",
    ],
    keywords="robotframework dashboard reporting database",
    author="Tim de Groot",
    author_email="tim-degroot@live.nl",
    url="https://github.com/timdegroot1996/robotframework-dashboard",
    license="MIT",
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "robotframework",
        "jinja2",
        "sqlite3",
    ],
    entry_points={
        "console_scripts": [
            "robotdashboard=robotframework-dashboard.robotdashboard:main",
        ]
    },
)
