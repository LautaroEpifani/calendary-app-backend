pipeline {
    agent any
    environment {
        MONGO_USERNAME = credentials('MONGO_USERNAME')
        MONGO_PASSWORD = credentials('MONGO_PASSWORD')
        MONGO_DATABASE = credentials('MONGO_DATABASE')
        MONGO_CLUSTER = credentials('MONGO_CLUSTER')
        JWT_SECRET = credentials('JWT_SECRET')
        SSH_CREDENTIALS = credentials('e80448cb-54ff-4778-83ff-860950b00e0f')
        SERVER_ADDR = '3.255.155.197'
    }
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Unit Tests') {
            steps {
                sh 'npm run test'
            }
        }
        stage('End-to-End Tests') {
            steps {
                sh 'npm run test:e2e'
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sshagent(credentials: ['SSH_CREDENTIALS']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i ${SSH_CREDENTIALS} ubuntu@${SERVER_ADDR} "cd /var/www/calendary-app-backend && sudo git stash && sudo git pull origin main && sudo npm install"
                        """
                    }
                }
            }
        }
    }
}
