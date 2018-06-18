:: ----------------------
:: KUDU Deployment Script
:: CUSTOM
:: ----------------------

@echo off
echo Deploying files...
xcopy %DEPLOYMENT_SOURCE%"\build" %DEPLOYMENT_TARGET% /Y /S
echo Finished successfully.
