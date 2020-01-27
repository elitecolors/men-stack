import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
private posts: Post[] = [];
private postUpdated = new Subject<Post[]>();

constructor(private http: HttpClient ){}


getPosts() {
  this.http.get<{message: string, posts}>('http://localhost:3000/api/posts')
   .pipe(map((postData) => {
    return postData.posts.map(post => {
      return{
        title: post.title,
        content: post.content,
        id: post._id
      };
    });
   }))
  .subscribe((transformedPost) => {
      this.posts = transformedPost;
      this.postUpdated.next([...this.posts]);

  });
}

getPosteUpdateListenner() {
  return this.postUpdated.asObservable();
}

getPost(id: string) {
  return this.http.get<{_id: string, title: string, content:string}>('http://localhost:3000/api/posts/' + id);
}

addPost(title: string, content: string) {
  const post: Post = {id: null , title: title, content: content };
  this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
  .subscribe(responseData => {
    post.id = responseData.postId;
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);

  });

}

updatePost(id : string, content: string, title: string ){
  const post: Post = {id: id, title: title, content: content };
   this.http.put('http://localhost:3000/api/posts/' + id, post)
   .subscribe(response => {
     const updatePosts=[...this.posts];
     const oldPostIndex= updatePosts.findIndex(p=>p.id===post.id);
     updatePosts[oldPostIndex]=post;
     this.posts= updatePosts;
     this.postUpdated.next([...this.posts]);

    });
}

deletePost(postId: string){
  this.http.delete('http://localhost:3000/api/posts'+postId)
  .subscribe(() => {
  const updatePosted = this.posts.filter(post => post.id !== postId);
  this.posts = updatePosted;
  this.postUpdated.next([...this.posts]);  });
}

}
