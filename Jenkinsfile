pipeline {
    agent { 
       docker {
           image 'docker-nest-mongo-nest-app'
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