import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
private posts: Post[] = [];
private postUpdated = new Subject<{posts: Post [], postCount: number}>();

constructor(private http: HttpClient, private router: Router ){}


getPosts(postPerPage,page) {
  const queryParams = `?pageSize=${postPerPage}&page=${page}`;
  this.http.get<{message: string, posts, maxPost: number}>('http://localhost:3000/api/posts' + queryParams)
   .pipe(map((postData) => {
    return {posts: postData.posts.map(post => {
      return{
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath
      };
    }), maxPost: postData.maxPost};
   }))
  .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postUpdated.next({
         posts: [...this.posts],
         postCount: transformedPostData.maxPost
        });

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
     this.router.navigate(['/']);
    });
}

deletePost(postId: string){
  return this.http.delete('http://localhost:3000/api/posts/' + postId);
}

}
