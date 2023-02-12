// ****** SELECT ITEMS **********

const alert = document.querySelector('.alert'); // alert paragraph
const form = document.querySelector('.grocery-form'); // form containing text field and submit button
const grocery = document.getElementById('grocery'); // text field to enter grocery item
const submitBtn = document.querySelector('.submit-btn'); // submit button
const list = document.querySelector('.grocery-list'); // div that is going to contain list of grocery items
const container = document.querySelector('.grocery-container'); // div that contain clear btn and gorcery item
const clearBtn = document.querySelector('.clear-btn'); // clear btn

let editElement;
let editFlag = false;
let editId = '';

// ****** EVENT LISTENERS **********

form.addEventListener ('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********

function addItem (e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    
    if(value  && !editFlag){
        createListItem(id,value);   
        showAlert('item add to the list', 'success');
        container.classList.add('show-container');
        addLocalStorage(id,value);
        setBacktoDefault();
    } else if (value && editFlag){
        editElement.innerHTML = value;
        showAlert('value changed', 'success');
        editLocalStorage(editId,value);
        setBacktoDefault();
    }else {
      showAlert('please enter value', 'danger');
    }
}

function showAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    },1000);
}

function setBacktoDefault (){
    grocery.value = '';
    editFlag = false;
    editId = '';
    submitBtn.textContent = 'submit';
}

function addLocalStorage(id,value){
    const grocery = {id:id, value:value};
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem('list',JSON.stringify(items));
}

function editLocalStorage(id,value){
    items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        } 
        return item;
    });
    localStorage.setItem('list',JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

function clearItems(){
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0){
        items.forEach(function(item){list.removeChild(item);});
    }
    container.classList.remove('show-container');
    showAlert('empty list', 'danger');
    localStorage.removeItem('list');
    setBacktoDefault();
}

function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length == 0){
        container.classList.remove('show-container');
    }
    showAlert('item removed', 'danger');
    setBacktoDefault();
    removeFromLocalStorage(id);
}

function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement =  e.currentTarget.parentElement.previousElementSibling;
    console.log(editElement);
    grocery.value = editElement.textContent;
    editFlag = true;
    editId = element.dataset.id;
    console.log(editId);
    submitBtn.textContent = 'edit';
}

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
       items.forEach(function(item){
           createListItem(item.id,item.value);
       });
       container.classList.add('show-container');
    }
}

function createListItem(id, value){
    const element = document.createElement('article');
       element.classList.add('grocery-item');
       const attr = document.createAttribute('data-id');
       attr.value = id;
       element.setAttributeNode(attr);
       element.innerHTML = `
       <p class="title">${value}</p>
       <div class="btn-container">
         <button type="button" class="edit-btn">
           <i class="fas fa-edit"></i>
         </button>
         <button type="button" class="delete-btn">
           <i class="fas fa-trash"></i>
         </button>
       </div>`;
     const  deleteBtn = element.querySelector('.delete-btn');
     const  editBtn = element.querySelector('.edit-btn');
     deleteBtn.addEventListener('click',deleteItem);
     editBtn.addEventListener('click',editItem);
     list.appendChild(element);
}