from ckan.tests import *

class TestAdminController(TestController2):

    def test_index(self):
        response = self.app.get(url_for(controller='admin'))
        # Test response...
        assert '<h1>Models' in response, response