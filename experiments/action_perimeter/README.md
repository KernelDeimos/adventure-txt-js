**Built the perimeter, not the area**

A naive approach to text adventure actions might be to implement every possible action for every possible object, as follows:

| Object | Look | Eat | Destroy |
| -- | -- | -- | -- |
| pencil | it's a pencil! | you can't | snap! |
| onion | how does it taste? | yum! | uhh.. squish? |
| book | you can't read! | you can't | rip! |

A better approach is to build the perimeter instead of the area:

```
eat: o => o.isEdible ? 'yum!' : "you can't!",
look: o => o.description || default_description(o),
destroy: o => {
    if ( o.unbreakable ) return "you can't!";
    attempt_destroy(o, player);
}
```