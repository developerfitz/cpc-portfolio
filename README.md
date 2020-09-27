# CPC Supplemental Tool (Examiner Portfolio)
A supplemental tool that automates a task to help reduce the time spent to evaluate an Examiner's portfolio during transition with room for improvement by using additional examiners feedback for features to improve portfolio evaluation. 

The idea stemmed from a personal problem I had and what appeared to be a need by others during the provided training of the provided tools.

### In Agile terms 
Epic
As an Examiner, I want a cohesive area with relevant data to efficiently evaluate my portfolio to add, remove, and keep CPC symbols.

Story
As an Examiner, I want to see the titles of the CPC symbols to decide if I should keep the symbol in my portfolio.





As an Examiner myself, I could see the impact first hand and how basic functionality was missing and under the time constraint automation could help improve the repetative tasks.

I built a functional prototype as a proof of concept, which could then be improved upon.



They didn't ask us what we needed.
They didn't provide us what we needed.
They didn't provide us with the time we needed.
Yet, they still expect us to get the work.

Guess we have to work with what we have, I hope this helps.



I'm an Examiner myself, so I understand the struggles we go through especially when they make changes like this TRP. 


What did you learn?
What was the biggest problem you run into?
How did you address the problems?

### Tech. Stack
**Frontend** 
- JavaScript + HTML / CSS 
- Amplify SDK (Cognito + OAuth)
- React + React router
- Netlify (Hosting)

**Backend**
- Python (Logic)
- AWS
  - Lambda (Compute)
  - S3 (Storage)
  - Boto3 SDK (Functions)
    - pre-signed urls
  - API Gateway (Routing) 
  - X-Ray (Monitoring)
  - Cloud Watch (Logging) 
- Openpyxl (excel module)



## Roadmap

### Rearchitect

While the prototype works, it is not architecture is not as clean as it can be and there are also, so performance that can be used.

- Utilize SDK on the client-side to interact with S3 and Lambda to avoid the use of a pre-signed url
- Use caching to improve performance and for Script and calls to the patentview API.
- CloudFront for distribution to edge
- SNS or web socket to allow communication when processing is complete and read for download.
- use a generator to get data from patents APIs



### Tech. Stack Additions

- AWS
  - Amplify SDK (S3, Lambda)
  - API Gateway (https or web socket)
  - CloudFront + Caching
  - SNS or Web socket