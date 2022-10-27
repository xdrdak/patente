# Patente

> St'une belle patente ça

Patente is an experimental way of creating step-by-step UI wizards using generator functions.

It is inspired by CLI tools of the same nature; You write code in a procedural manner and things render
on screen in a procedural way. 

Patente leverages generator functions and good old javascript. The intent is to not build a meta-language
on top of yaml or start straight from a wysiwyg editor, but rather use the already expressive nature 
of javascript to build out wizards. Think "less-code", rather than codeless or "configful"

## A word of warning to all who enters

Let this be a fun lesson in what seemed like a great idea (in my head) but turned out to be mostly quite bad.

This kinda started with a fun concept: what if I could sequentially write what ui inputs I wish to render and
await for some interaction before sending it off to any arbitrary command.

While the final outlook looks cool, the actual experience of writting it all was mediocre at best. The issue
with this approach is simple: we're crossing too many boundaries. We need to juggle between browser land and
server land. We needed to maintain a list of workflows, ui elements, base ui elements and of course, an server
to be able to do anything with either the file system or any potential external system.

The goal was to make the writting experience of workflows (e.g, bunch a forms rigged together) in a nice and
procedural way. What ended up was a whole heap of plumbing for... what could have been just a few views and
some clever link injection.

Which brings up some of the good that came outta this experiment:

First, turborepo is a must for any project in JS going forwards. The fact that it's mostly opt in is top tier.

Second, JSX is still the best "templating engine". I've (re)tried nunjucks, ejs, mustache for this project and in
the end, nothing beats JSX for just straight up templating content. The fact that you can inline server code with
markup in a transparent manner is NOT to be underestimated. Maybe my brain is mush from so much React, but the
way things "flows" with JSX feels quite natural. Dynamically composing your view directly in the server, rather
than crossing the boundaries and loading up a template is just plain fun. JSX is by far, the best DSL I had
to work with.

I'll be re-thinking a bit the `patente` philosophy, but ditch most of the criss-crossing between server and client.