pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        APP_NAME = 'jenkins-cicd-demo'
        IMAGE_NAME = 'jenkins-cicd-demo'
        CONTAINER_NAME = 'jenkins-container'
        APP_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the application sourcecode...'
                checkout scm
            }
        }
        stage('Build') {
            steps {
                echo 'Building Docker image'
                powershell '''
                    docker build -t ${env:IMAGE_NAME}:${env:BUILD_NUMBER} .
                '''
            }
        }
        stage('Test') {
            steps {
                echo 'Checking Syntax and Running tests'
                powershell '''
                docker run --rm ${env:IMAGE_NAME}:${env:BUILD_NUMBER} node --check app.js
                if ($LASTEXITCODE -ne 0) {
                    throw "Application syntax test failed"
                }
                '''

                
    
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application container'
                powershell '''
                    docker rm -f ${env:CONTAINER_NAME} 2>$null
                    docker run -d --name ${env:CONTAINER_NAME} `
                      --restart unless-stopped `
                      -p 3000:3000 `
                      ${env:IMAGE_NAME}:${env:BUILD_NUMBER}

                    if ($LASTEXITCODE -ne 0) {
                        exit 1
                    }
                '''
            }
        }

    }
}
post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
