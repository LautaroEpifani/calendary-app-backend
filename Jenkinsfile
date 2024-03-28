pipeline {
    agent { 
       docker {
           image 'node:latest'
       }
    }

    stages {
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