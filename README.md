# api-analysis
Code for analysing API request logs and automatically run design quality heuristics

## Input format
The input should be a comma separated CSV with the following format: 

```
contentType, method, domain, path
```



## Quality of individual services
node parse.js input.csv > requests.csv

```
Output:

1. domain // Domain name
2. undescore // avoid using underscore in URIs -> should I check only the path?
3. lowercase // lowercase in paths
4. slash // avoid trailing forward slash
5. versionPath // version number in path
6. versionParam // version number in params
7. apiDomain // API denomination in domain
8. apiPath // API denomination in path
9. resource // last resource
10. parent // parent resource
11. crudResource // avoid using CRUD names
12. resourceExtension // resource extension
13. hideExtension // hide scriptig technology
14. formatExtension // use content negotiation (not format extentions)
15. queryExtension // use content negotiation (extension in query params)
16. nQueryParams // number of query params
17. tunnelCrudParam // Tunneling over GET / POST (crud in params)
18. tunnelActionQuery // Tunneling over GET / POST (action in query)
19. tunnelIdQuery // Tunneling over GET / POST (id in query)
20. tunnelAPIResource // Tunneling over GET / POST (API as resource name)
21. matchMedia // If format extension exists then it should match the media type  
22. cacheQuery // Avoid using cache as a param (use headers instead)  
              
```


## Agreggating services by API provider
The input file of the previous step should be sorted before being processed:

sort requests.csv > sorted.csv


node aggregate.js sorted.csv > levels.csv

```
Output:

1. maturity_level
2. instances
3. number_resources
4. number_methods
5. res_ok_undescore
6. res_ok_lowercase
7. res_ok_slash
8. res_ok_versionPath
9. res_ok_versionParam
10. res_api_in_domain
11. res_api_in_path
12. res_ok_crudResource
13. res_ok_hideExtension
14. res_ok_formatExtension
15. res_ok_queryExtension
16. res_max_nQueryParams
17. res_ok_tunnelCrudParam
18. res_ok_tunnelActionQuery
19. res_ok_tunnelIdQuery
20. res_ok_tunnelAPIRes
21. res_ok_matchMedia
22. res_ok_cacheQuery
23. domain
```

              
