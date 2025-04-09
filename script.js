document.addEventListener('DOMContentLoaded', () => {
    const classDropdown = document.getElementById('classSelect');  // ✅ fixed here
  
    const studentDropdowns = [
      document.querySelector('select[name="member1"]'),
      document.querySelector('select[name="member2"]'),
      document.querySelector('select[name="member3"]'),
      document.querySelector('select[name="member4"]')
    ];
  
    const mentorDropdowns = [
      document.querySelector('select[name="mentor1"]'),
      document.querySelector('select[name="mentor2"]'),
      document.querySelector('select[name="mentor3"]'),
      document.querySelector('select[name="mentor4"]')
    ];
  
    const mentors = [
      "Jyoti Khurpude (Mante)", "Sanjivani Kulkarni", "Mrunal Fatangare", "Hemlata Ohal",
      "Farahhdeeba Shaikh", "Prerana Patil", "Yogesh Patil", "Vilas Rathod",
      "Pradeep Paygude", "Kajal Chavan", "Megha Dhotey", "Pallavi Nehete",
      "Nita Dongre", "Mrunal Aware", "Shilpa Shitole", "Vaishali Langote", "Sulkshana Malwade"
    ];
  
    const populateMentorDropdowns = () => {
      mentorDropdowns.forEach(dropdown => {
        dropdown.innerHTML = `<option value="">-- Select Mentor --</option>`;
        mentors.forEach(mentor => {
          const option = document.createElement('option');
          option.value = mentor;
          option.textContent = mentor;
          dropdown.appendChild(option);
        });
      });
  
      updateMentorOptions();
    };
  
    const updateMentorOptions = () => {
      const selectedMentors = mentorDropdowns.map(d => d.value);
      mentorDropdowns.forEach(dropdown => {
        const currentValue = dropdown.value;
        Array.from(dropdown.options).forEach(option => {
          if (
            option.value &&
            option.value !== currentValue &&
            selectedMentors.includes(option.value)
          ) {
            option.disabled = true;
          } else {
            option.disabled = false;
          }
        });
      });
    };
  
    const updateStudentOptions = () => {
      const selectedStudents = studentDropdowns.map(d => d.value);
      studentDropdowns.forEach(dropdown => {
        const currentValue = dropdown.value;
        Array.from(dropdown.options).forEach(option => {
          if (
            option.value &&
            option.value !== currentValue &&
            selectedStudents.includes(option.value)
          ) {
            option.disabled = true;
          } else {
            option.disabled = false;
          }
        });
      });
    };
  
    mentorDropdowns.forEach(dropdown => {
      dropdown.addEventListener('change', updateMentorOptions);
    });
  
    studentDropdowns.forEach(dropdown => {
      dropdown.addEventListener('change', updateStudentOptions);
    });
  
    classDropdown?.addEventListener('change', async () => {
      const classValue = classDropdown.value;
      if (!classValue) return;
  
      try {
        const res = await fetch(`/.netlify/functions/getStudents?class=${encodeURIComponent(classValue)}`);
  
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
  
        const data = await res.json();
  
        if (!data.students || !Array.isArray(data.students)) {
          throw new Error("Invalid response format: 'students' array missing");
        }
  
        const students = data.students;
  
        studentDropdowns.forEach(dropdown => {
          dropdown.innerHTML = `<option value="">-- Select Student --</option>`;
          students.forEach(student => {
            const option = document.createElement('option');
            option.value = student;
            option.textContent = student;
            dropdown.appendChild(option);
          });
        });
  
        updateStudentOptions();
  
      } catch (err) {
        console.error("⚠️ Failed to fetch student list:", err);
        alert("⚠️ Failed to load students for selected class. Please try again or contact admin.");
      }
    });
  
    populateMentorDropdowns();
  });
  // ✅ Handle form submission
document.getElementById("teamForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const classSelect = document.getElementById("classSelect").value;
  const members = [
    document.querySelector('select[name="member1"]').value,
    document.querySelector('select[name="member2"]').value,
    document.querySelector('select[name="member3"]').value,
    document.querySelector('select[name="member4"]').value,
  ];
  const mentors = [
    document.querySelector('select[name="mentor1"]').value,
    document.querySelector('select[name="mentor2"]').value,
    document.querySelector('select[name="mentor3"]').value,
    document.querySelector('select[name="mentor4"]').value,
  ];
  const ideas = [
    document.querySelector('textarea[name="idea1"]').value,
    document.querySelector('textarea[name="idea2"]').value,
    document.querySelector('textarea[name="idea3"]').value,
  ];

  // ✅ Validate
  if (!classSelect || members.includes("") || mentors.includes("") || ideas.includes("")) {
    alert("⚠️ Please fill all fields before submitting.");
    return;
  }

  const teamData = {
    class: classSelect,
    members,
    mentors,
    ideas
  };

  try {
    const res = await fetch("/.netlify/functions/submitTeam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(teamData)
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Your team was registered!");
      document.getElementById("teamForm").reset();
    } else {
      alert("❌ Failed to submit team: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error("❌ Submission error:", err);
    alert("❌ Failed to connect to server. Please try again later.");
  }
});
