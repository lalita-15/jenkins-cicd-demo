
pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        IMAGE_NAME = 'lalita15/jenkins-cicd-demo'
        CONTAINER_NAME = 'jenkins-container'
        APP_PORT = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub'
                checkout scm
            }
        }

        stage('Docker Hub Login') {
            steps {
                echo 'Authenticating with Docker Hub'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds3',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    powershell '''
                        $env:DOCKERHUB_TOKEN | docker login `
                            --username $env:DOCKERHUB_USER `
                            --password-stdin

                        if ($LASTEXITCODE -ne 0) {
                            throw "Docker Hub login failed"
                        }

                        Write-Host "Docker Hub login successful"
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker image'

                powershell '''
                    docker build --pull=false `
                        -t ${env:IMAGE_NAME}:${env:BUILD_NUMBER} .

                    if ($LASTEXITCODE -ne 0) {
                        throw "Docker image build failed"
                    }

                    docker tag `
                        ${env:IMAGE_NAME}:${env:BUILD_NUMBER} `
                        ${env:IMAGE_NAME}:latest

                    if ($LASTEXITCODE -ne 0) {
                        throw "Docker image tagging failed"
                    }

                    Write-Host "Docker image built successfully"
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Testing Node.js application syntax'

                powershell '''
                    docker run --rm `
                        ${env:IMAGE_NAME}:${env:BUILD_NUMBER} `
                        node --check app.js

                    if ($LASTEXITCODE -ne 0) {
                        throw "Application syntax test failed"
                    }

                    Write-Host "Application syntax test passed"
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing versioned and latest images'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds3',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    powershell '''
                        $env:DOCKERHUB_TOKEN | docker login `
                            --username $env:DOCKERHUB_USER `
                            --password-stdin

                        if ($LASTEXITCODE -ne 0) {
                            throw "Docker Hub login failed before push"
                        }

                        docker push ${env:IMAGE_NAME}:${env:BUILD_NUMBER}

                        if ($LASTEXITCODE -ne 0) {
                            throw "Versioned image push failed"
                        }

                        docker push ${env:IMAGE_NAME}:latest

                        if ($LASTEXITCODE -ne 0) {
                            throw "Latest image push failed"
                        }

                        Write-Host "Images pushed successfully"
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application container locally'

                powershell '''
                    docker rm -f ${env:CONTAINER_NAME} 2>$null

                    docker run -d `
                        --name ${env:CONTAINER_NAME} `
                        --restart unless-stopped `
                        -p ${env:APP_PORT}:3000 `
                        ${env:IMAGE_NAME}:${env:BUILD_NUMBER}

                    if ($LASTEXITCODE -ne 0) {
                        throw "Application deployment failed"
                    }

                    Write-Host "Application deployed successfully"
                    Write-Host "Open http://localhost:3000"
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: CI/CD pipeline completed!'
        }

        failure {
            echo 'FAILURE: Check the stage where the pipeline failed.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
