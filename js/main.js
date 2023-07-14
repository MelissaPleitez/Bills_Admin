const form = document.querySelector('#form')
const lists= document.querySelector('#list_expenses')

document.addEventListener('DOMContentLoaded', ()=>{
    const inicial_budget = prompt('Enter your budget:')
    Number(inicial_budget)
    if(inicial_budget === '' || inicial_budget=== null || isNaN(inicial_budget) || inicial_budget <=0){
     window.location.reload()
    }
    main_budget= new BUDGET(inicial_budget)
    ui.adding_inicial_budget(main_budget)
    

})


class BUDGET {
    constructor(budget){
        this.budget= Number(budget) 
        this.remaining= Number(budget) 
        this.bills= []
    }


    adding_list_budget(new_list){
    this.bills= [...this.bills, new_list]
    this.calculate_remaining()
    }

    removing_expenses(id){
     this.bills = this.bills.filter(bill=> bill.id !== id)
     this.calculate_remaining()
    }

    calculate_remaining(){
    const calculte = this.bills.reduce((total, bill)=> total + bill.expenses_amount, 0)
    this.remaining = this.budget - calculte
    }



}


class UI{

    adding_inicial_budget(main_budget){
        const {budget, remaining}= main_budget
        document.querySelector('#budget span').innerHTML= budget
        document.querySelector('#remaining span').innerHTML= remaining
    }


    creating_list_HTM(bills){
    this.cleaning_HTML()

      bills.forEach(bill => {
       const {expenses_name, expenses_amount, id}= bill

      const li = document.createElement('li')
      li.dataset.id=id
      li.classList.add('btn', 'btn-primary', 'p-3', 'text-center', 'm-3', 'text-decoration-none')
      li.innerHTML= `${expenses_name} <span class="badge bg-secondary">$${expenses_amount}</span> `
     

      const btn = document.createElement('button')
      btn.classList.add('btn', 'btn-danger')
      btn.innerHTML='Remove'
      btn.onclick = ()=>{
        deleting_expenses(id)
      }

      li.appendChild(btn)

      lists.appendChild(li)
        
      });


    }

    alerts(message, type){

        const div = document.createElement('div')
        div.classList.add('alert')

        if(type=== 'error'){
            div.classList.add('alert-danger')
            
        }else{
            div.classList.add('alert-success')
        }

        div.textContent= message

       document.querySelector('#alerts').insertBefore(div, form)

       setTimeout(() => {
        div.remove()
       }, 3000);
       

    }


    cleaning_HTML(){
        while(lists.firstChild){
            lists.removeChild(lists.firstChild)
        }
    }


    recalculating_remaining(remaining){
        document.querySelector('#remaining span').innerHTML= remaining
    }


    changing_bgcolor(main_budget){
    const {remaining, budget}= main_budget
     const restDiv= document.querySelector('#remaining')
    if((budget/4)>remaining){
        restDiv.classList.remove('alert-success', 'alert-warning')
        restDiv.classList.add('alert-danger')
    }else if((budget/2)>remaining){
        restDiv.classList.remove('alert-success')
        restDiv.classList.add('alert-warning')
    }else{
        restDiv.classList.remove('alert-danger', 'alert-warning')
        restDiv.classList.add('alert-success')
    }

    if(remaining<=0){
        ui.alerts('Your budget ran out', 'error')
        form.querySelector('button[type="submit"]').disabled=true
    }



    }

}

let main_budget

const ui = new UI()


form.addEventListener('submit', submitting_all)


function submitting_all(e){
e.preventDefault()


const expenses_name= document.querySelector('#name_expenses').value
const expenses_amount= document.querySelector('#amount_expenses').value

if(expenses_name === '' || expenses_amount === ''){
  
    ui.alerts('Empty Inputs', 'error')
}else if(isNaN(expenses_amount) || expenses_amount <=0){
  
    ui.alerts('Incorrect Value', 'error')
}else{

    const new_expenses_list= {expenses_name, expenses_amount, id: Date.now()}

    main_budget.adding_list_budget(new_expenses_list)

    ui.alerts('Adding Expenses', 'good')

    const {bills}= main_budget
    ui.creating_list_HTM(bills)

    

    ui.changing_bgcolor(main_budget)

    const {remaining}= main_budget
    ui.recalculating_remaining(remaining)

    form.reset()
}

} 


function deleting_expenses(id){

    main_budget.removing_expenses(id)

    ui.changing_bgcolor(main_budget)

    const {bills, remaining}= main_budget

    ui.creating_list_HTM(bills)

    ui.recalculating_remaining(remaining)


}