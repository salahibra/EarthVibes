import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { Post } from '../../models/user-data.model';
import { where, orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  
  userEmail = signal('');
  userId = signal('');
  posts = signal<Post[]>([]);
  newPostTitle = signal('');
  newPostContent = signal('');
  isLoading = signal(false);
  isSaving = signal(false);

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userEmail.set(user.email || '');
        this.userId.set(user.uid);
        this.loadUserPosts(user.uid);
      }
    });
  }

  async loadUserPosts(userId: string) {
    this.isLoading.set(true);
    try {
      this.firestoreService.getUserDocuments<Post>('posts', userId)
        .subscribe(posts => {
          this.posts.set(posts);
          this.isLoading.set(false);
        });
    } catch (error) {
      console.error('Error loading posts:', error);
      this.isLoading.set(false);
    }
  }

  async addPost() {
    if (!this.newPostTitle() || !this.newPostContent()) {
      return;
    }

    this.isSaving.set(true);
    try {
      const post: Post = {
        userId: this.userId(),
        title: this.newPostTitle(),
        content: this.newPostContent(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.firestoreService.addDocument('posts', post);
      this.newPostTitle.set('');
      this.newPostContent.set('');
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async deletePost(postId: string) {
    try {
      await this.firestoreService.deleteDocument('posts', postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
