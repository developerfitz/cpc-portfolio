# CPC Supplemental Tool (Examiner Portfolio)
A supplemental tool that automates a task to help reduce the time spent to evaluate an Examiner's portfolio during transition. 

The idea stemmed from a personal problem I had and what appeared to be a need by other Examiners during training of tools that were already provided.

As an Examiner myself, I could see the impact first hand and how basic functionality was missing and under the time constraint automation could help simplify the task.

### In Agile terms: 
**Epic**  
As an Examiner, I want a cohesive area with relevant data to efficiently evaluate my portfolio for addition, removal, or maintaining CPC symbols.

**Story**  
As an Examiner, I want to see the titles of the CPC symbols to decide if a CPC symbol should be added, removed, or kept in my portfolio.


I built a functional prototype as a proof of concept, which could then be improved upon with feedback from other Examiners.


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
  - Boto3 SDK
    - pre-signed urls
  - API Gateway (Routing) 
  - X-Ray (Monitoring)
  - Cloud Watch (Logging) 
- Openpyxl (Excel Library)



## Plans For Redesign (architect)
While the prototype works, the architecture can be improved, along with other things.

- Utilize SDK on the client-side to interact with S3 and Lambda to avoid the use of a pre-signed url
- Use caching to improve performance and for Script and calls to the [Patentview API](https://api.patentsview.org/cpc_subsection.html).
- CloudFront for distribution to edge
- SNS or web socket to allow communication when processing is complete and read for download.
- use a generator to get data from patents APIs


### Tech. Stack Additions
- AWS
  - Amplify SDK (S3, Lambda)
  - API Gateway (https or web socket)
  - CloudFront + Caching
  - SNS or Web socket


### Lessons Learned
- Taking a business need and solving it with software can be found in any situation, but having the support and backing is also important.
- External API limits are present and should be thought about prior to implementation
- Caching helps with both performance and limits