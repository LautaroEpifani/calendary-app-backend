pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                sh 'sudo apt install npm docker mongodb'
            }
        }
        stage('Build') {
            steps {
                sh 'npm install'  
                sh 'npm run build' 
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