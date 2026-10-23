
pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        IMAGE_NAME = 'jenkins-cicd-demo'
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

        stage('Build') {
            steps {
                echo 'Building Docker image'

                powershell '''
                    docker build -t ${env:IMAGE_NAME}:${env:BUILD_NUMBER} .

                    if ($LASTEXITCODE -ne 0) {
                        throw "Docker image build failed"
                    }
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Testing application syntax inside Docker'

                powershell '''
                    docker run --rm ${env:IMAGE_NAME}:${env:BUILD_NUMBER} node --check app.js

                    if ($LASTEXITCODE -ne 0) {
                        throw "Application syntax test failed"
                    }

                    Write-Host "Application syntax test passed"
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application container'

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

                    Write-Host "Deployment command completed"
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Jenkins CI/CD pipeline completed!'
        }

        failure {
            echo 'FAILURE: Check the Console Output for details.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
