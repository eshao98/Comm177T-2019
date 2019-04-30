'''
The following script has two commands:

deploy will update the S3 bucket with the contents of 
the local file system, including pushing static files
to the s3 bucket and deleting stale files.

cachebust will invalidate all assets from AWS CloudFront
'''

from invoke import task

@task
def deploy(c):
	c.run("aws s3 sync _site/ s3://comm177t-2019-eshao98 --delete")

@task
def cachebust(c):
	c.run("aws cloudfront create-invalidation --distribution-id --paths '/*'")