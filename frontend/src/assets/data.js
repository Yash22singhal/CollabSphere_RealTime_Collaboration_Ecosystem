import user_icon from './images/user-icon.png';
import doc_icon from './images/doc-icon.png';
import new_doc from './images/new-doc.png';
import md_doc from './images/md-doc.png';
import code_editor from './images/code-editor.png';
import error_icon from './images/error-icon.png';

export const assets = {
  user_icon,
  doc_icon,
  new_doc,
  md_doc,
  code_editor,
  error_icon,
}

export const docTypes = [
  {
    type: 'Text',
    logo: assets.doc_icon,
  },
  {
    type: 'MarkDown',
    logo: assets.md_doc,
  },
  {
    type: 'Code Editor',
    logo: assets.code_editor,
  }
]

// demoSteps data
export const demoSteps = [
    {
      title: "Step 1: Create Your Project",
      description: "Get started by creating a new project in CollabSphere. Add collaborators and start working together.",
    },
    {
      title: "Step 2: Share Documents",
      description: "Share documents with your team members to start collaborating in real-time.",
    },
    {
      title: "Step 3: Track Changes",
      description: "Track changes made by collaborators and see the edits in real-time.",
    },
    {
      title: "Step 4: Export Your Document",
      description: "Once the collaboration is done, export the document in your preferred format.",
    },
  ];
  
  // testimonials data
  export const testimonials = [
    {
      name: "John Doe",
      position: "Product Manager",
      company: "Tech Corp",
      quote: "CollabSphere has greatly improved our team’s productivity. The platform is easy to use and highly effective!",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Jane Smith",
      position: "Software Engineer",
      company: "DevWorks",
      quote: "CollabSphere helped streamline our document workflows. It's a must-have tool for our team!",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Sam Wilson",
      position: "CEO",
      company: "InnovateX",
      quote: "The real-time collaboration features of CollabSphere are a game changer for our business. Highly recommended!",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "John Doe",
      position: "Product Manager",
      company: "Tech Corp",
      quote: "CollabSphere has greatly improved our team’s productivity. The platform is easy to use and highly effective!",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Jane Smith",
      position: "Software Engineer",
      company: "DevWorks",
      quote: "CollabSphere helped streamline our document workflows. It's a must-have tool for our team!",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Sam Wilson",
      position: "CEO",
      company: "InnovateX",
      quote: "The real-time collaboration features of CollabSphere are a game changer for our business. Highly recommended!",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  ];
  