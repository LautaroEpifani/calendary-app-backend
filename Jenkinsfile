pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    stages {       
        stage('Build') {
            steps {
                sh 'npm install' 
                sh "printenv | sort"
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