'''
The following script has two commands:

deploy will update the S3 bucket with the contents of 
the local file system, including pushing static files
to the s3 bucket and deleting stale files.

cachebust will invalidate all assets from AWS CloudFront
'''

from invoke import task

@task
def deploy(c, source):
	c.run("aws s3 sync ~/Comm177T-2019/_site/" + source + " s3://comm177t-2019-eshao98 --delete")
	# c.run("aws s3 mv ~/Comm177T-2019/_site/" + source + " s3://comm177t-2019-eshao98")

@task
def cachebust(c, dist_id):
	c.run("aws cloudfront create-invalidation --distribution-id " + dist_id + " --paths '/*'")