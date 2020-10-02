# CPC Supplemental Tool (Examiner Portfolio)
A supplemental tool that automates a task to help reduce the time spent to evaluate an Examiner's portfolio during transition. 

The idea stemmed from a personal problem I had and what appeared to be a need by other Examiners during training of tools that were already provided.

As an Examiner myself, I could see the impact first hand and how basic functionality was missing and under the time constraint automation could help simplify the task.

### In Agile terms: 
**Epic**  
As an Examiner, I want a cohesive area with relevant data to efficiently evaluate my portfolio for addition, removal, or maintaining CPC symbols.

**Story**  
As an Examiner, I want to see the titles of the CPC symbols to decide if a CPC symbol should be added, removed, or kept in my portfolio.

------- 

This project is a functional prototype as a proof of concept, which could then be improved upon with feedback from other Examiners.

![cpc portfolio demo](demos/demo-gif)

### Tech. Stack
**Frontend** 
- JavaScript + HTML / CSS 
- Amplify SDK (Cognito, OAuth, S3)
- React + React router
- Netlify (Hosting)

**Backend**
- Python (Logic)
- AWS
  - Lambda (Compute)
  - S3 (Storage)
  - Boto3 SDK
  - API Gateway (Routing) 
  - X-Ray (Monitoring)
  - Cloud Watch (Logging) 
- Openpyxl (Excel Library)




### Lessons Learned
- Taking a business need and solving it with software can be found in any situation, but having the support and backing is also important.
- External API limits are present and should be thought about prior to implementation
- Caching helps with both performance and limits