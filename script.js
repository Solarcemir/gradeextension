 // initialize
 const firstItem = document.querySelector('.course-item');
 attachListenersToItem(firstItem);
 
 
     const addItemBtn = document.getElementById('add-item-btns');
     const itemsContainer = document.getElementById('course-items-container');
   
     addItemBtn.addEventListener('click', () => {
   const newItem = document.createElement('div');
   newItem.className = 'course-item';
 
   newItem.innerHTML = `
     <input type="text" name="item" required>
     <input type="number" name="worth" required>
     <input type="number" name="grade" required>
     <input type="number" name="percent" required>
   `;
 
   itemsContainer.appendChild(newItem);
   attachListenersToItem(newItem); // important
 });
 
 
 
 
     function calculateCourseMark() {
   let totalWorth = 0;
   let totalWeightedMark = 0;
 
   const items = document.querySelectorAll('.course-item');
   items.forEach(item => {
     const worth = parseFloat(item.children[1].value) || 0;
     const grade = parseFloat(item.children[2].value) || 0;
     
     const percentOfCourse = (worth * grade) / 100;
 
     item.children[3].value = percentOfCourse.toFixed(2);  // show calculated value in the input
 
     totalWorth += worth;
     totalWeightedMark += percentOfCourse;
   });
 
   // Updtate the values
   document.getElementById('value-worth').textContent = totalWorth.toFixed(2) + '%';
   document.getElementById('value-mark').textContent = totalWorth > 0 ? ((totalWeightedMark / totalWorth) * 100).toFixed(2) + '%' : '0%';
   document.getElementById('value-course-mark').textContent = totalWeightedMark.toFixed(2) + '%';
   document.getElementById('current-mark').textContent = totalWorth > 0 ? ((totalWeightedMark / totalWorth) * 100).toFixed(2) + '%' : '0%';
 }
 
 function attachListenersToItem(item) {
   const inputs = item.querySelectorAll('input[type="number"]');
   inputs.forEach(input => {
     input.addEventListener('blur', calculateCourseMark);
     input.addEventListener('blur',  updateFinalWorth); 
     input.addEventListener('blur', updateRequiredMarks);
   });
  
 }
 
 
 
 function updateFinalWorth() {
 
 const items = document.querySelectorAll('.course-item');
 let totalWorth = 0;
 
 
 items.forEach(item => {
   const worthInput = item.querySelector('input[name="worth"]');
   const worth = parseFloat(worthInput.value) || 0;
 
   if(!isNaN(worth)) {
     totalWorth += worth;
   }
 
   const finalWorth = Math.max(0, 100 - totalWorth); 
   document.getElementById('final-worth').textContent = `${finalWorth}%`;
 })
 }
 
 
 
 
 
 function updateRequiredMarks() {
 
   const finalWorthText = document.getElementById('final-worth').textContent.replace('%', '');
 
   const finalWorth = parseFloat(finalWorthText) / 100;
 
   const current = document.getElementById('current-mark').textContent.replace('%', ''); 
 
   const currentmark = parseFloat(current);
 
   if (isNaN(finalWorth) || finalWorth == 0 || isNaN(currentmark)) {
     return; 
   }
   const grades = [50, 60, 70, 80, 90, 100];
 
 
   grades.forEach(grade => {
     const requiredMark = ((grade - (currentmark * (1 - finalWorth))) / finalWorth).toFixed(2);
     const element = document.getElementById(`goal-${grade}`);
     if(element){
       element.textContent = `${requiredMark}%`;
     } else {
       console.error(`Element with ID goal-${grade} not found.`);
     }
   });
 
 }
 