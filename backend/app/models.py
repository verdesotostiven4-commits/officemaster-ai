from pydantic import BaseModel

class GenerateRequest(BaseModel):
    prompt: str
    file_type: str = 'auto'
    style: str = 'professional'
    title: str = 'OfficeMaster AI'
