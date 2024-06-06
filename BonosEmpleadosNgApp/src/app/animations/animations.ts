import { trigger, state, style, animate, transition } from '@angular/animations';

export const contrast = trigger('contrast', [
  state('small', style({
    fontWeight: 'normal',
    fontSize: '16px'
  })),
  state('large', style({
    fontWeight:'bold',
    fontSize: '17px',
    color:"green",
    borderColor:"green"
  })),
  transition('small <=> large', animate('150ms ease-in-out')),
]);

export const fadeInOut = trigger('fadeInOut', [
  state('void', style({
    opacity: 0
  })),
  transition('void <=> *', animate(400)),
]);

//boxShadow: "inset -5px -5px 15px 5px rgba(255,255,255,.8),  5px 5px 15px 5px rgba(0,0,0,.2)"
