:: ----------------------
:: KUDU Deployment Script
:: CUSTOM
:: ----------------------

@echo off
echo Deploying files...
xcopy %DEPLOYMENT_SOURCE% %DEPLOYMENT_TARGET% /Y
echo Finished successfully.
