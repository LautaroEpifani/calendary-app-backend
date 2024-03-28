pipeline {
    agent any
    stages {
        stage('Setup') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 14.x') {
                
                    sh 'npm --version'
                }
            }
        }
       
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