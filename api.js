const express=require('express');
const mysql=require('mysql2');
const cors=require('cors');


const mysql_config=require('./imp/mysql_config');
const functions=require('./imp/function');


const API_AVAILABILITY= true;
const API_VERSION = '1.0.0';

const app=express();
app.listen(3000,()=>{
    console.log("API está executando")
})

app.use((req,res,next)=>{
    if(API_AVAILABILITY){
        next();
    }else{
        res.json(functions.respose('atenção','API está em manutenção',0,null))
    }
})

const connection=mysql.createConnection(mysql_config);

app.use(cors());

//rotas
//rotas inicial (entrada)
app.get('/',(req,res)=>{
    res.json(functions.respose("sucesso", "API está rodando",0,null))
})
//endpoint
//rota para consulta completa
app.get('/tasks',(req,res)=>{
    connection.query('SELECT * FROM tasks',(err,rows)=>{ 
        if(err){
        res.json(functions.respose('sucesso','Deu boa',rows.length,rows))
        }else{
            res.json(functions.respose('erro',err.message,0,null))
        }
    })
})

//rota para fazer um consulta de tasks por id
app.get('/tasks/:id',(req,res)=>{
    const id = req.params.id;
    connection.query('SELECT * FROM tasks WHERE id = ?',[id],(err,rows)=>{
        if(!err){
            if(rows.length>0){
                res.json(functions.respose('Sucesso','Sucesso na pesquisa',rows.length,rows))
            }else{
                res.json(functions.respose('Atenção','Não foi encontrada a tasks selecionada',0,null))
            }
        }else{
            res.json(functions.respose('erro',err.message,0,null));
        }
    })
})
//rota para atualizar o status da task pelo id selecionado
app.put('/tasks/:id/status/:status',(req,res)=>{
    const id=req.params.id;
    const status=req.params.status;
    connection.query('UPDADE tasks SET status = ? WHERE id = ?',[status,id],(err,rows))
    if(!err){
        if(rows.affectedRows>0){
            res.json(functions.respose('Sucesso','Sucesso na alteração de status',rows.affectedRows,rows))
        }else{
            res.json(functions.respose('Alerta','task não',0,null))
        }
    }else{
        res.json(functions.respose('erro',err.message,0,null))
    }
})
//rota para excluir uma tasks
//método delete
app.delete('/tasks/:id/delete',(req,res)=>{
    const id=req.params.id;
    connection.query('DELETE FROM tasks WHERE id = ?',[id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.respose("Sucesso",'task deletada',rows.affectedRows,null))
            }else{res.json(functions.respose('Atenção','task não encontrada',0,null))}
        }else{
            res.json(functions.respose('erro',err.message,0,null))
        }
    })
})


app.use((req,res)=>{
    res.json(functions.respose('atenção','rota não encontrada',0,null))
})

