import sys
from azure.devops.connection import Connection
from msrest.authentication import BasicAuthentication
from azure.devops.v6_0.work_item_tracking.models import JsonPatchOperation
from azure.devops.v6_0.work_item_tracking.models import Wiql

def main(argv):
        args = sys.argv
        url = 'https://dev.azure.com/'
        personal_access_token = args[1]
        #personal_access_token = 'ancelccwsbh67rt7yvfkbmbafyqiukfbbur7ww4qmakauycqrwuq'
        # Create a connection to Azure DevOps using the API and authentication
        print('PAT',personal_access_token)
        credentials = BasicAuthentication('', personal_access_token)
        connection = Connection(base_url=url, creds=credentials)
        # Define the project and work item type to create
        project_name = 'Sai'
        work_item_type = 'Task'

        # Define the fields and values for the new work item
        new_work_item = [
          JsonPatchOperation(
          op='add',
          path='/fields/System.Title',
          value='My Task'
        ),
        JsonPatchOperation(
        op='add',
        path='/fields/System.Description',
        value='This is a description for my task'
          ),
        ]
 
        work_item_client = connection.clients.get_work_item_tracking_client()
        # result = work_item_client.create_work_item(
        #    document=new_work_item,
        #    project=project_name,
        #    type=work_item_type
        # )
        work_item_title = 'test1'
        #print('New work item created with ID: {}'.format(result.id))
        #work_items = wit_client.query_by_wiql("SELECT [System.Id], [System.Title], [System.State] FROM WorkItems WHERE [System.Title] = '{}'".format(work_item_title)).work_items
        wiql_query = Wiql(query="SELECT [System.Id], [System.Title], [System.State] FROM workitems WHERE [System.WorkItemType] = 'Task'")

        query_result = work_item_client.query_by_wiql(wiql_query).work_items
        for work_item_ref in query_result:
          work_item = work_item_client.get_work_item(work_item_ref.id)
          print(f"{work_item.id} - {work_item.fields['System.Title']} - {work_item.fields['System.State']}")
        
        print("Hello, world!")
    
        return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv))
