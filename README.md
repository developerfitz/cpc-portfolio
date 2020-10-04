# Supplemental Toolbox (Examiner Portfolio)
A supplemental toolbox that automates tasks to help reduce the time spent to evaluate an Examiner's portfolio during our transition period. 

The idea stemmed from a personal problem, and what appeared to be a need by other Examiners during training of tools that were already provided.

As an Examiner myself, I could see the impact first hand and how basic functionality was missing and under the time constraint automation could help simplify tasks.

### In Agile terms: 
**Epic**  
As an Examiner, I want a cohesive area with relevant data to efficiently evaluate my portfolio for the addition, removal, or keeping of CPC symbols.

**Story**  
As an Examiner, I want to see the titles of the CPC symbols to decide if a CPC symbol should be added, removed, or kept in my portfolio.

------- 

This project is a functional prototype as a proof of concept, which can then be improved upon with feedback from other Examiners.

![cpc portfolio demo](demos/mini-demo.gif)

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
- Taking a business need and translating that into a software solution 
- Having the support and backing is important to have solutions to progress forward.
- External API limits are present and should be thought about prior to implementation


### Remove for Improvements
- Caching to help with both performance and API limits
- Break code structure down to smaller modules
- Feedback by examiners to add additional tools