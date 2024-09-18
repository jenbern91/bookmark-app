const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmakForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, Focus on Input
function showModal (){
    modal.classList.add('show-modal');
    websiteNameEl.focus(); // so the cursor is on that line
}

// Modal Event Listeners
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click', ()=>modal.classList.remove('show-modal'));
window.addEventListener('click', (e)=> (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate Form
function validate(nameValue, urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    
    if (!nameValue || !urlValue){
        alert('please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)){
        alert('Please provide a valid web addres');
        return false;
    }

    // Valid
    return true;

}

// Build Bookmarks DOM
function buildBookmarks(){
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';
    // Build Items
    bookmarks.forEach((bookmark) => {
        const { name, url} = bookmark;
        
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        
        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        
        // Append to bookmarks container
            //in an order -- small to big objects
        linkInfo.append(favicon, link) // allows you to append multiple things at once unlike appendchild
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    }); 
}
// Fetch Bookmarks
function fetchBookmarks(){
// Get bookmarks from local Storage if available
if (localStorage.getItem('bookmarks')){
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
} else{
    // Creat a bookmarks array in localStorage
    bookmarks = [
    {
        name: 'Google',
        url: 'https://google.com',
    },
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}
buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url){
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url){
    bookmarks.splice(i, 1);
    }
  });

// Update bookmarks array in localStorage, re-populate DOM   
localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
fetchBookmarks();
}




    //TIP
    // google 'regex url' - top answer
    // Validate form

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault(); // preventDefault() cancels the event if it is cancelable, default action that belongs tothe event will not occur
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

// Dynamically add http so the link will work

    if(!urlValue.includes('http://') && !urlValue.includes('http://')){
        urlValue=`https://${urlValue}`;
    }
   if (!validate(nameValue, urlValue)){
    return false;
   }
   const bookmark = {
    name: nameValue,
    url: urlValue,
   };
   bookmarks.push(bookmark);
   localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); //only accepts strings
   fetchBookmarks();
   bookmakForm.reset();
   websiteNameEl.focus();
}

// Event Listener
bookmakForm.addEventListener('submit', storeBookmark);

 // On Load, Fetch Bookmarks
 fetchBookmarks();