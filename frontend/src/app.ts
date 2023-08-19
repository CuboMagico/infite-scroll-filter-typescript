const postsContainerDOM = document.querySelector("[data-js=posts-container]")
const loaderDOM = document.querySelector("[data-js=loader]")
const filterDOM = document.querySelector("[data-js=filter]")


let page = 1


type PlaceholderAPIDataReturnSchema = {
    userId: number,
    id: number,
    title: string,
    body: string
}


const getPosts = async (): Promise<Array<PlaceholderAPIDataReturnSchema>> => {
    const req = await 
        fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`)
    const res: Array<PlaceholderAPIDataReturnSchema> = await req.json()

    return res
}


const generatePostsTemplate = (posts: Array<PlaceholderAPIDataReturnSchema>) => 
    posts.map(({ body, id, title }) => `
        <div class="post">
            <div class="number">${id}</div>

            <div class="post-info">
                <h2 class="post-title">${title}</h2>
                <p class="post-body">${body}</p>
            </div>
        </div>
    `).join("")


const insertPostsIntoDOM = async (): Promise<void> => {
    const posts = await getPosts()
    const postsTemplate = generatePostsTemplate(posts)

    if (postsContainerDOM) postsContainerDOM.innerHTML += postsTemplate
}


const getNextPosts = () => {
    setTimeout(() => {
        page++
        insertPostsIntoDOM()
    }, 300)
}


const removeLoader = () => {
    setTimeout(() => {
        loaderDOM?.classList.remove("show")
        getNextPosts()
    }, 1000)
}


const showLoader = () => {
    loaderDOM?.classList.add("show")
    removeLoader()
}


const handleScrollHitPageBottom = () => {
    if (document.scrollingElement) {
        const { clientHeight, scrollHeight, scrollTop } = document.scrollingElement
        const isPageAlmostHitBottom = clientHeight + scrollTop >= scrollHeight

        if (isPageAlmostHitBottom) showLoader()
    }
}


const setPostDisplayIfIncludeInputValue = (inputValue: string) => 
    (post: Element) => {
        const postTitle = post.querySelector(".post-title")?.textContent?.toLowerCase()
        const postBody = post.querySelector(".post-body")?.textContent?.toLowerCase()

        if (postTitle?.includes(inputValue) || postBody?.includes(inputValue)) {
            (post as HTMLDivElement).style.display = "flex"
            return
        }

        (post as HTMLDivElement).style.display = "none"
}


const handleInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase()
    const postsDOM = document.querySelectorAll(".post")

    postsDOM.forEach(setPostDisplayIfIncludeInputValue(inputValue))
}


insertPostsIntoDOM()


window.addEventListener("scroll", handleScrollHitPageBottom)
filterDOM?.addEventListener("input", handleInputChange)