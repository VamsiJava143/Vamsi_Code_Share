document.addEventListener('DOMContentLoaded', function () {
    const teacherBtn = document.getElementById('teacher-btn');
    const studentBtn = document.getElementById('student-btn');
    const teacherPanel = document.getElementById('teacher-panel');
    const shareBtn = document.getElementById('share-btn');
    const snippetsContainer = document.getElementById('snippets-container');
  
    let codeSnippets = [];
  
    // Initialize view
    showStudentView();
    loadSnippets();
  
    teacherBtn.addEventListener('click', showTeacherView);
    studentBtn.addEventListener('click', showStudentView);
    shareBtn.addEventListener('click', previewNewCode);
  
    function showTeacherView() {
      teacherBtn.classList.remove('btn-secondary');
      teacherBtn.classList.add('btn-primary', 'active');
      studentBtn.classList.remove('btn-primary', 'active');
      studentBtn.classList.add('btn-secondary');
      teacherPanel.classList.remove('d-none');
    }
  
    function showStudentView() {
      studentBtn.classList.remove('btn-secondary');
      studentBtn.classList.add('btn-primary', 'active');
      teacherBtn.classList.remove('btn-primary', 'active');
      teacherBtn.classList.add('btn-secondary');
      teacherPanel.classList.add('d-none');
    }
  
    function loadSnippets() {
      fetch('snippets.json')
        .then(response => response.json())
        .then(data => {
          codeSnippets = data;
          renderSnippets();
        })
        .catch(error => {
          snippetsContainer.innerHTML = `<p class="text-danger">Error loading snippets: ${error}</p>`;
        });
    }
  
    function previewNewCode() {
      const title = document.getElementById('code-title').value.trim();
      const code = document.getElementById('code-content').value.trim();
  
      if (!title || !code) {
        alert('Please enter both title and code');
        return;
      }
  
      let language = 'plaintext';
      if (code.includes('<?php')) language = 'php';
      else if (code.includes('<html') || code.includes('<!DOCTYPE html')) language = 'html';
      else if (code.includes('console.log')) language = 'javascript';
      else if (code.includes('def ') || code.includes('print(')) language = 'python';
      else if (code.includes('#include')) language = 'cpp';
  
      const newSnippet = {
        id: Date.now(),
        title: title,
        code: code,
        language: language,
        timestamp: new Date().toISOString()
      };
  
      codeSnippets.unshift(newSnippet);
      renderSnippets();
  
      document.getElementById('code-title').value = '';
      document.getElementById('code-content').value = '';
  
      console.log("Copy this to snippets.json to make it public:", newSnippet);
      alert("Preview added! Copy the new snippet object from console to snippets.json for all students to see.");
    }
  
    function renderSnippets() {
      snippetsContainer.innerHTML = '';
  
      if (codeSnippets.length === 0) {
        snippetsContainer.innerHTML = '<p>No code snippets shared yet.</p>';
        return;
      }
  
      codeSnippets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
      codeSnippets.forEach(snippet => {
        const snippetElement = document.createElement('div');
        snippetElement.className = 'code-container';
  
        const titleElement = document.createElement('h4');
        titleElement.textContent = snippet.title;
  
        const dateElement = document.createElement('small');
        dateElement.className = 'text-muted';
        dateElement.textContent = new Date(snippet.timestamp).toLocaleString();
  
        const preElement = document.createElement('pre');
        const codeElement = document.createElement('code');
        codeElement.className = snippet.language;
        codeElement.textContent = snippet.code;
        preElement.appendChild(codeElement);
  
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn';
        copyBtn.innerHTML = 'Copy';
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(snippet.code).then(() => {
            copyBtn.innerHTML = 'Copied!';
            setTimeout(() => {
              copyBtn.innerHTML = 'Copy';
            }, 2000);
          });
        });
  
        snippetElement.appendChild(titleElement);
        snippetElement.appendChild(dateElement);
        snippetElement.appendChild(preElement);
        snippetElement.appendChild(copyBtn);
  
        snippetsContainer.appendChild(snippetElement);
  
        hljs.highlightElement(codeElement);
      });
    }
  });
  
