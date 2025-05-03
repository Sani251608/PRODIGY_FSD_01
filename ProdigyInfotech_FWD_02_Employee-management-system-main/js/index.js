
let regList = document.querySelector("#regList");
let deleteAllBtn = document.querySelector("#delete-all");
let searchEl = document.querySelector("#search");
let registerForm = document.querySelector("#registerForm");
let submitBtn = document.querySelector("#submitBtn");
let updateBtn = document.querySelector("#updateBtn");

let allRegData = [];
let url = ""; // Profile image url

// Load data from localStorage if available
if (localStorage.getItem("allRegData") !== null) {
  allRegData = JSON.parse(localStorage.getItem("allRegData"));
}

// Function to render data
const renderData = () => {
  regList.innerHTML = "";  // Clear the list

  allRegData.forEach((data, index) => {
    regList.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${data.profile}" width="30" alt="Profile"/></td>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.mobile}</td>
        <td>${data.dob}</td>
        <td>
          <button class="edit-btn btn btn-primary" data-index="${index}"><i class="fa fa-edit"></i></button>
          <button class="del-btn btn btn-danger" data-index="${index}"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `;
  });

  // Attach event listeners to delete buttons
  document.querySelectorAll(".del-btn").forEach((btn) => {
    btn.onclick = () => {
      let index = btn.getAttribute("data-index");
      if (confirm("Are you sure you want to delete this record?")) {
        allRegData.splice(index, 1);  // Remove from array
        localStorage.setItem("allRegData", JSON.stringify(allRegData));  // Update localStorage
        renderData();  // Re-render data
      }
    };
  });

  // Attach event listeners to edit buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = () => {
      let index = btn.getAttribute("data-index");
      let data = allRegData[index];

      document.querySelector("#name").value = data.name;
      document.querySelector("#email").value = data.email;
      document.querySelector("#mobile").value = data.mobile;
      document.querySelector("#dob").value = data.dob;
      document.querySelector("#password").value = data.password;
      url = data.profile;

      updateBtn.disabled = false;
      submitBtn.disabled = true;

      updateBtn.onclick = () => {
        allRegData[index] = {
          name: document.querySelector("#name").value,
          email: document.querySelector("#email").value,
          mobile: document.querySelector("#mobile").value,
          dob: document.querySelector("#dob").value,
          password: document.querySelector("#password").value,
          profile: url
        };
        localStorage.setItem("allRegData", JSON.stringify(allRegData));  // Update data
        swal("Data Updated", "Successfully!", "success");
        $('#myModal').modal('hide');
        renderData();
        updateBtn.disabled = true;
        submitBtn.disabled = false;
      };
    };
  });
};

// Form submission for adding new user
registerForm.onsubmit = (e) => {
  e.preventDefault();

  let name = document.querySelector("#name").value;
  let email = document.querySelector("#email").value;
  let mobile = document.querySelector("#mobile").value;
  let dob = document.querySelector("#dob").value;
  let password = document.querySelector("#password").value;

  let checkEmail = allRegData.find((data) => data.email === email);

  if (checkEmail === undefined) {
    let profileFile = document.querySelector("#profile").files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
      allRegData.push({
        name,
        email,
        mobile,
        dob,
        password,
        profile: reader.result
      });
      localStorage.setItem("allRegData", JSON.stringify(allRegData));
      swal("Data Added", "Successfully!", "success");
      registerForm.reset();
      $('#myModal').modal('hide');
      renderData();
    };

    if (profileFile) {
      reader.readAsDataURL(profileFile);
    } else {
      // Default profile image if no file selected
      allRegData.push({
        name,
        email,
        mobile,
        dob,
        password,
        profile: "profile.png"
      });
      localStorage.setItem("allRegData", JSON.stringify(allRegData));
      swal("Data Added", "Successfully!", "success");
      registerForm.reset();
      $('#myModal').modal('hide');
      renderData();
    }
  } else {
    swal("Email exists!", "Please use a different email.", "warning");
  }
};

// Search functionality
searchEl.addEventListener("input", (e) => {
  let query = e.target.value.toLowerCase();
  let filteredData = allRegData.filter((data) => data.name.toLowerCase().includes(query) || data.email.toLowerCase().includes(query));
  allRegData = filteredData;
  renderData();
});

// Call renderData initially to load data
renderData();
