import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
private posts: Post[] = [];
private postUpdated = new Subject<Post[]>();

constructor(private http: HttpClient, private router: Router ){}


getPosts() {
  this.http.get<{message: string, posts}>('http://localhost:3000/api/posts')
   .pipe(map((postData) => {
    return postData.posts.map(post => {
      return{
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath
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
  return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
}

addPost(title: string, content: string, image : File ) {
  const postData = new FormData();
  postData.append('title', title);
  postData.append('content', content);
  postData.append('image', image,title);

  this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
  .subscribe(responseData => {
    const post: Post = {
       id: responseData.post.id,
       title: responseData.post.title,
       content: responseData.post.content,
       imagePath: responseData.post.imagePath
    };

    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
    this.router.navigate(['/']);
  });

}

updatePost(id: string, content: string, title: string, image: File | string  ) {
  let postData ;
  if( typeof(image) === 'object'  ) {
    const postData = new FormData();
    postData.append('id', id);
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
  } else {
    const postData: Post = {
      id: id,
      title: title ,
      content: content ,
       imagePath: image
      };
  }
   this.http
   .put("http://localhost:3000/api/posts/" + id, postData )
   .subscribe(response => {
     const updatePosts=[...this.posts];
     const oldPostIndex= updatePosts.findIndex(p=>p.id===id);
     const post = {
      id: id,
      title: title ,
      content: content ,
      imagePath: ""
     };

     updatePosts[oldPostIndex]=post;
     this.posts= updatePosts;
     this.postUpdated.next([...this.posts]);
     this.router.navigate(['/']);
    });
}

deletePost(postId: string){
  this.http.delete('http://localhost:3000/api/posts/' + postId)
  .subscribe(() => {
  const updatePosted = this.posts.filter(post => post.id !== postId);
  this.posts = updatePosted;
  this.postUpdated.next([...this.posts]);  });
}

}
