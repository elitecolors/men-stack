import { Component , OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
templateUrl :  './post-list.component.html',
selector : 'app-post-list'
})
export class PostListComponent  implements OnInit , OnDestroy {

   posts: Post[] = [];
   private postSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postSub = this.postsService.getPosteUpdateListenner()
      .subscribe((posts: Post[]) => {
        this.posts = posts;

      });

  }

  onDelete(postId) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}
