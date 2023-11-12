# React + TypeScript + Vite + Docker + Tailwind + MySQL

This Project has been quite fun.

I've explicitly not used Express as I've wanted to see how difficult/verbose my backend would be without a Framework/Tool.\
If I had used a Framework it would have been Fastify, probably.

## To get this running

I believe docker-compose should be set up correctly but it obviously needs to be installed on your machine.

```bash
   docker-compose build && docker-compose up
```

## Wishlist and what I would have loved to add with more time on my hands

There's a lot of tools I would have loved to use and try, but since this was a Challenge I had to get things done, first.

- Would have loved to use Next.js for Server Side Rendering.
- I would have loved to write (more meaningful) tests. I would also have loved to setup E2E-Tests with Cypress.
- I would have loved to set up a Component Browser like StoryBook. However, the components used were not all that complex and probably overkill in this setup.
- The App already works with Dark and Light Themes that are set by the operating system. A toggle would have been a nice addition.
- Depending on where this project would find its use I would highly recommend implementing some sort of Authorization Logic (like oAuth) so that not everybody has access to the backend and thus the Database.
- That also means a login/logout page/view.
- I would have loved to implement some kind of search engine so that database entries would be easier to find.
- I would also think it would make sense to filter some cards out, i.e. if I'm only interested in empty battery devices.
- I dropped a few TODO's somewhere with things I'd improve. (Like paging for the Database)
