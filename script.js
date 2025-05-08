let courses = [];
let activeCourseId = null;
let courseWeightsChart = null;

// Initialize the pie chart
function initializeChart() {
  const ctx = document.getElementById('course-weights-chart').getContext('2d');
  courseWeightsChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#8e5be2',
          '#a375e7',
          '#ff73fa',
          '#6200ff',
          '#9b59b6',
          '#d7bde2'
        ],
        borderColor: '#40444b',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ffffff',
            font: {
              size: 12,
              family: 'Inter',
              weight: '600'
            }
          }
        },
        title: {
          display: true,
          text: 'Course Weights',
          color: '#ffffff',
          font: {
            size: 16,
            family: 'Inter',
            weight: '700'
          },
          padding: {
            bottom: 10
          }
        }
      }
    }
  });
}

// Update the pie chart with current course weights
function updateChart() {
  if (!courseWeightsChart) return;

  const labels = courses.map(course => course.name);
  const weights = courses.map(course => course.weight);

  courseWeightsChart.data.labels = labels;
  courseWeightsChart.data.datasets[0].data = weights;
  courseWeightsChart.update();
}

// Function to get the appropriate Mr. Incredible image based on current grade
function getMrIncredibleImage(currentGrade) {
  if (currentGrade >= 90) return 'super.jpg';
  if (currentGrade >= 70) return 'normal.jpg';
  if (currentGrade >= 60) return 'confused.jpg';
  if (currentGrade >= 50) return 'uncanny.jpg';
  return 'gg.jpg';
}

// Update the extra content with the Mr. Incredible image
function updateExtraContent(currentGrade) {
  const extraContent = document.querySelector('.extra-content');
  if (extraContent) {
    const imageSrc = getMrIncredibleImage(currentGrade);
    extraContent.innerHTML = `
      <h3>Grade Status</h3>
      <img src="${imageSrc}" alt="Mr. Incredible Meme" style="width: 250px; height: 250px; object-fit:content;">
    `;
  }
}

// Initialize chart on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeChart();
});

document.getElementById('add-course-btn').addEventListener('click', () => {
  const courseName = document.getElementById('course').value.trim();
  const courseWeight = parseFloat(document.getElementById('weight').value) || 0;

  if (!courseName || courseWeight <= 0) {
    alert("Please enter a valid course name and weight.");
    return;
  }

  const courseId = `course-${Date.now()}`;
  const course = {
    id: courseId,
    name: courseName,
    weight: courseWeight,
    items: []
  };
  courses.push(course);

  const courseLink = document.createElement('div');
  courseLink.className = 'course-link';
  courseLink.textContent = courseName;
  courseLink.dataset.courseId = courseId;
  courseLink.addEventListener('click', () => showCourse(courseId));
  document.getElementById('courses-list').prepend(courseLink);

  createCourseContent(course);
  showCourse(courseId);

  // Update the pie chart
  updateChart();

  // Add extra content after the first course is added
  if (courses.length === 1) {
    const extraContent = document.createElement('div');
    extraContent.className = 'extra-content';
    extraContent.innerHTML = `
      <h3>Grade Status</h3>
      <img src="normal.jpg" alt="Mr. Incredible Meme" style="width: 300px; height: 300px; object-fit: contain;">
    `;
    document.querySelector('.main-container').appendChild(extraContent);
  }

  document.getElementById('course').value = '';
  document.getElementById('weight').value = '0.5';
});

function createCourseContent(course) {
  const courseContent = document.createElement('div');
  courseContent.id = course.id;
  courseContent.className = 'course-section';
  courseContent.innerHTML = `
    <h2>${course.name} (Weight: ${course.weight})</h2>
    <div class="main-info">
      <h3>Course Item</h3>
      <h3>Worth %</h3>
      <h3>Your Mark %</h3>
      <h3>% of Course Mark</h3>
    </div>
    <div class="course-items-container" id="items-${course.id}"></div>
    <button type="button" class="add-item-btn">+ Add Item</button>
    <div class="calculations">
      <h3>Current Mark</h3>
      <h3>Worth %</h3>
      <h3>Your Mark %</h3>
      <h3>% of Course Mark</h3>
    </div>
    <div class="calculation-values">
      <div id="current-mark-${course.id}" class="current-mark">0%</div>
      <div class="value-box" id="value-worth-${course.id}">0%</div>
      <div class="value-box" id="value-mark-${course.id}">0%</div>
      <div class="value-box" id="value-course-mark-${course.id}">0%</div>
    </div>
    <div class="final-grade">
      <h3>Final Exam Worth:</h3>
      <div id="final-worth-${course.id}">0%</div>
    </div>
    <h3>required % on the final</h3>
  
    
    <div class="final-calculations">
      <div class="percentage-div"><h3>to finish with a 50%</h3><div id="goal-50-${course.id}">0%</div></div>
      <div class="percentage-div"><h3>to finish with a 60%</h3><div id="goal-60-${course.id}">0%</div></div>
      <div class="percentage-div"><h3>to finish with a 70%</h3><div id="goal-70-${course.id}">0%</div></div>
      <div class="percentage-div"><h3>to finish with a 80%</h3><div id="goal-80-${course.id}">0%</div></div>
      <div class="percentage-div"><h3>to finish with a 90%</h3><div id="goal-90-${course.id}">0%</div></div>
      <div class="percentage-div"><h3>to finish with a 100%</h3><div id="goal-100-${course.id}">0%</div></div>
    </div>
    <button type="button" class="remove-course-btn">× Remove Course</button>

      <button type="button" class="modes-btn">× Switch Lighting </button>
  `;
  document.getElementById('course-content').appendChild(courseContent);

  const addItemBtn = courseContent.querySelector('.add-item-btn');
  const itemsContainer = courseContent.querySelector('.course-items-container');
  addItemBtn.addEventListener('click', () => {
    const newItem = document.createElement('div');
    newItem.className = 'course-item';
    newItem.innerHTML = `
      <input type="text" name="item" placeholder="Item name" required>
      <input type="number" name="worth" placeholder="%" required>
      <input type="number" name="grade" placeholder="%" required>
      <input type="number" name="percent" placeholder="%" readonly>
    `;
    itemsContainer.appendChild(newItem);
    attachListenersToItem(newItem, course.id);
  });

  addItemBtn.click();

  const removeBtn = courseContent.querySelector('.remove-course-btn');
  removeBtn.addEventListener('click', () => removeCourse(course.id));
}

function showCourse(courseId) {
  document.querySelectorAll('.course-section').forEach(section => {
    section.classList.remove('active');
  });

  const courseSection = document.getElementById(courseId);
  courseSection.classList.add('active');
  activeCourseId = courseId;

  if (activeCourseId) {
    const currentMarkElement = document.getElementById(`current-mark-${activeCourseId}`);
    const currentGrade = parseFloat(currentMarkElement.textContent.replace('%', '')) || 0;
    updateExtraContent(currentGrade);
  }
}

function removeCourse(courseId) {
  courses = courses.filter(course => course.id !== courseId);

  const courseLink = document.querySelector(`.course-link[data-course-id="${courseId}"]`);
  if (courseLink) courseLink.remove();

  const courseContent = document.getElementById(courseId);
  if (courseContent) courseContent.remove();

  if (activeCourseId === courseId) {
    activeCourseId = null;
    if (courses.length > 0) {
      showCourse(courses[0].id);
    } else {
      const extraContent = document.querySelector('.extra-content');
      if (extraContent) extraContent.remove();
    }
  }

  // Update the pie chart after removing a course
  updateChart();
}

function calculateCourseMark(courseId) {
  let totalWorth = 0;
  let totalWeightedMark = 0;

  const items = document.querySelectorAll(`#items-${courseId} .course-item`);
  items.forEach(item => {
    const worth = parseFloat(item.children[1].value) || 0;
    const grade = parseFloat(item.children[2].value) || 0;
    const percentOfCourse = (worth * grade) / 100;

    item.children[3].value = percentOfCourse.toFixed(1);
    totalWorth += worth;
    totalWeightedMark += percentOfCourse;
  });

  const currentMark = totalWorth > 0 ? ((totalWeightedMark / totalWorth) * 100).toFixed(1) : '0';
  document.getElementById(`value-worth-${courseId}`).textContent = totalWorth.toFixed(1) + '%';
  document.getElementById(`value-mark-${courseId}`).textContent = totalWorth > 0 ? ((totalWeightedMark / totalWorth) * 100).toFixed(1) + '%' : '0%';
  document.getElementById(`value-course-mark-${courseId}`).textContent = totalWeightedMark.toFixed(1) + '%';
  document.getElementById(`current-mark-${courseId}`).textContent = currentMark + '%';

  // Update the Mr. Incredible image based on the current grade
  if (courseId === activeCourseId) {
    const currentGrade = parseFloat(currentMark) || 0;
    updateExtraContent(currentGrade);
  }

  updateFinalWorth(courseId);
  updateRequiredMarks(courseId);
}

function attachListenersToItem(item, courseId) {
  const inputs = item.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => calculateCourseMark(courseId));
  });
}

function updateFinalWorth(courseId) {
  const items = document.querySelectorAll(`#items-${courseId} .course-item`);
  let totalWorth = 0;

  items.forEach(item => {
    const worthInput = item.querySelector('input[name="worth"]');
    const worth = parseFloat(worthInput.value) || 0;
    if (!isNaN(worth)) {
      totalWorth += worth;
    }
  });

  const finalWorth = Math.max(0, 100 - totalWorth);
  document.getElementById(`final-worth-${courseId}`).textContent = `${finalWorth}%`;
}

function updateRequiredMarks(courseId) {
  const finalWorthText = document.getElementById(`final-worth-${courseId}`).textContent.replace('%', '');
  const finalWorth = parseFloat(finalWorthText) / 100;
  const current = document.getElementById(`current-mark-${courseId}`).textContent.replace('%', '');
  const currentMark = parseFloat(current);

  if (isNaN(finalWorth) || finalWorth === 0 || isNaN(currentMark)) {
    return;
  }

  const grades = [50, 60, 70, 80, 90, 100];
  grades.forEach(grade => {
    const requiredMark = ((grade - (currentMark * (1 - finalWorth))) / finalWorth).toFixed(1);
    const element = document.getElementById(`goal-${grade}-${courseId}`);
    if (element) {
      element.textContent = `${requiredMark}%`;
    } else {
      console.error(`Element with ID goal-${grade}-${courseId} not found.`);
    }
  });
}


