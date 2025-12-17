This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First time setup only
```bash
npx create-next-app@latest
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Prompt
1. Click on page.tsx or select add context from ai chat
> I want you to create a button that will redirect to /dashboards that will be the dashboard for managing api keys. it will have a ui for CRUD API for api keys@ranjen/app/page.tsx 
2. select page.tsx under dashboard , then type propmt
> I want you to implement a UI for Groot for managing user API keys.
3. go to https://app.tavily.com/home , add a key , screenshot the page , paste it in chat and prompt
> I like the design, make it like this.
4. after that keep prompmt till make it similar ui by screenshot and put in the comment
5. click on create api key in the reference ui , screenshot the page to show what happen at our ui when add new record
> Make when clicking a "create" or the plus symbol to add a record,  open a model like this.
6. to connect to db sign in to supabase[https://supabase.com/dashboard] and create a new project as ranjen in the dashboard and generate the password , save it somewhere
7. create .env.local file , inside that type:DB_URL= 
8. Then in prompt write
> Ok. Now I want you to help me connect this CRUD API to a real database which is hosted on Supabase.
9. The above created supabase_setup.md , refer to that and setup in your supabase from browser
10. do test by insert, update delete record and make sure it works.
11. check the https://app.tavily.com/home for the copy to clipboard function ui , make it similar here as well by screenshot the image , put in the prompt and type
> I want a popup like this when copying to clipboard API key.
12. create same pop up for crud operations
> Now I want you to add popups when I create, edit, and delete the api keys.
13. for delete make the pop-up show in red by prompt
> When deleting API key, change the popup color to red.