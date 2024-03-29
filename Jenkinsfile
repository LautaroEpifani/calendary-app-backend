pipeline {
    agent any
    environment {
        MONGO_USERNAME = credentials('MONGO_USERNAME')
        MONGO_PASSWORD = credentials('MONGO_PASSWORD')
        MONGO_DATABASE = credentials('MONGO_DATABASE')
        MONGO_CLUSTER = credentials('MONGO_CLUSTER')
        JWT_SECRET = credentials('JWT_SECRET')
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
                 echo 'Despliegue completado.'
            }
        }
    }
}