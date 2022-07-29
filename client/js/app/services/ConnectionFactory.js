    let _connection = null;
    let _version = 1;
    const _dbName = 'aluraframe';
    const _stores = ['negociacoes'];
    let _close;

export class ConnectionFactory {

        // static _connection;
        // static _version = 1;
        // static _dbName = 'aluraframe';
        // static _stores = ['negociacoes'];

        // static _close;

        constructor(){
            throw new Error("A classe não pode ser instanciada");
        }

        static getConnection(){

                return new Promise((resolve,reject) => {
                    
                    const openRequest = window.indexedDB.open(_dbName,_version);

                    openRequest.onupgradeneeded = (event) => {
                        console.log("Cria ou altera um banco já existente");
                        ConnectionFactory._createStores(event.target.result);
                    };

                    openRequest.onsuccess = (event) => {
                        console.log("Conexão obtida com sucesso");
                        if(!_connection){
                            _connection = event.target.result;
                            _close = _connection.close.bind(_connection );
                            _connection.close = function(){
                                throw new Error("Não é possivel fechar diretamente a conexão");
                            }
                        }
                        resolve(_connection);
                    };

                    openRequest.onerror = (event) => {
                        console.log(event.target.error);
                        reject(event.target.error.name);
                    };

                });               
        }


        static _createStores(connection){
            _stores.forEach(store => {
                if(connection.objectStoreNames.contains(store))
                    connection.deleteObjectStore(store);        
                connection.createObjectStore(store, {autoIncrement: true});
            });
        }


        static closeConnection(){
            if(_connection){
                _close();
                _connection = null;
            }
        }

    }