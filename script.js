document.addEventListener("DOMContentLoaded",()=>{
    const storedTasks=JSON.parse(localStorage.getItem("tasks"));
    if(storedTasks){
        storedTasks.forEach((task)=>tasks.push(task));
        updateTasksList();
        updateStats();
    }
    //theme
    const savedTheme=localStorage.getItem("theme");
    if(savedTheme){
        document.body.setAttribute("theme",savedTheme);
    }
});
const change=document.querySelector(".theme");
change.addEventListener("click",()=>{
    const currentTheme=document.body.getAttribute("theme");
    if(currentTheme==="dark"){
        document.body.setAttribute("theme","light");
        localStorage.setItem("theme","light");
    }else{
        document.body.setAttribute("theme","dark");
        localStorage.setItem("theme","dark");
    }
});
const searchInput = document.querySelector(".search");
const filterTasks = () => {
    const searchText = searchInput.value.toLowerCase();
    const allTasks = document.querySelectorAll(".taskItem");
    allTasks.forEach((task) => {
        const taskText =
            task.querySelector("p").innerText.toLowerCase();
            task.style.display = taskText.includes(searchText)? "flex": "none";
    });
};
searchInput.addEventListener("input", filterTasks);

searchInput.addEventListener("blur", ()=>{
    searchInput.value="";
    filterTasks();
});
let tasks=[];
const saveTasks=()=>{
    localStorage.setItem('tasks',JSON.stringify(tasks));
}
const refresh=()=>{
    updateTasksList();
    filterTasks();
    updateStats();
    saveTasks();
}
const addTask=()=>{
    const taskInput=document.querySelector("#taskInput");
    const text=taskInput.value.trim();

    if(text){
        tasks.push({ text:text, completed:false});
        refresh();
    }
    taskInput.value="";
};
const toggleTaskComplete=(index)=>{
    tasks[index].completed=!tasks[index].completed;
    refresh();
}
const deleteTask=(index)=>{
    tasks.splice(index,1);
    refresh();
}
const editTask=(index)=>{
    const taskInput=document.querySelector("#taskInput");
    taskInput.value=tasks[index].text;

    tasks.splice(index,1)
    refresh();
}
const updateStats=()=>{
    const completeTasks=tasks.filter(task=> task.completed).length;
    const totalTasks=tasks.length;
    const progress= (completeTasks/totalTasks)*100;
    const progressBar=document.querySelector("#progress");
    progressBar.style.width=`${progress}%`

    document.querySelector("#numbers").innerText=`${completeTasks}/${totalTasks}`;
}
const updateTasksList=()=>{
    const taskList=document.querySelector(".task-list");
    taskList.innerHTML=""

    tasks.forEach((task,index)=>{
        const listItem=document.createElement("li");
        listItem.innerHTML=`
        <div class="taskItem ${task.completed?"completed":""}">
            <div class="task">
                <input type="checkbox" class="checkbox" ${task.completed?"checked":""}/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO6iylu6jjkfg7z1HiaS4p6bm25xynb-0i5Q&s" onclick="editTask(${index})"/>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInwV61cOHRqdcvDrYgOIR_lzcr6Wszg7Wqg&s" onclick="deleteTask(${index})"/>
            </div>
        </div>`;
        listItem.addEventListener("change", ()=> toggleTaskComplete(index));
        taskList.append(listItem);
    });
};
document.querySelector("#newTask").addEventListener("click", function(e){
    e.preventDefault();

    addTask();
});