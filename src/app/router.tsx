import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

// Public Pages
import { HomePage } from './pages/home';
import { DiscoverPage } from './pages/discover';
import { MoviesPage } from './pages/movies';
import { SeriesPage } from './pages/series';
import { ActorsPage } from './pages/actors';
import { ProfilePage } from './pages/profile';
import { EditProfilePage } from './pages/edit-profile';
import { ListDetailPage } from './pages/list-detail';
import { ReviewsPage } from './pages/reviews-complete';
import { NotificationsCenterPage } from './pages/notifications-center';
import { AwardsMainPage } from './pages/awards-main';
import { AwardDetailPage } from './pages/award-detail';
import { GenresPage, CommunityPage, NewsPage, AboutPage, ContactPage, FAQPage, TermsPage, PrivacyPage, VIPPage, UserProfilePage, SearchPage, SeriesDetailPage, EpisodeDetailPage, ActorDetailPage, GenreDetailPage, ReviewDetailPage, NewsDetailPage, CollectionDetailPage, NotFoundPage, VerifyEmailPage, TwoFactorPage, OnboardingPage } from './pages/all-stub-pages';

// Detail Pages
import { MovieDetailPage } from './pages/movie-detail';

// Auth Pages
import { LoginPage } from './pages/auth/login';
import { SignupPage } from './pages/auth/signup';
import { SignupCompletePage } from './pages/auth/signup-complete';
import { ForgotPasswordPage } from './pages/auth/forgot-password';
import { OtpPage } from './pages/auth/otp';
import { ResetPasswordPage } from './pages/auth/reset-password';

// User Dashboard
import { DashboardLayout } from './pages/dashboard/layout';
import { DashboardOverview } from './pages/dashboard/overview';
import { DashboardWatchlist, DashboardFavorites, DashboardHistory, DashboardRatings, DashboardReviews, DashboardComments, DashboardFollowers, DashboardFollowing, DashboardLists, DashboardRecommendations, DashboardNotifications, DashboardMessages, DashboardPrivacy, DashboardSecurity, DashboardBilling, DashboardVIP, DashboardHelp, DashboardProfile, DashboardEditProfile } from './pages/dashboard/all-dashboard-pages';

// Admin Panel
import { AdminLayout } from './pages/admin/layout';
import { AdminDashboard, AdminUsers, AdminMovies, AdminSeries, AdminPeople, AdminReviews, AdminReports, AdminAnalytics, AdminSettings } from './pages/admin/all-admin-pages';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/actors" element={<ActorsPage />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/awards" element={<AwardsMainPage />} />
        <Route path="/award/:id" element={<AwardDetailPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/vip" element={<VIPPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />

        {/* Lists */}
        <Route path="/list/:id" element={<ListDetailPage />} />

        {/* Notifications */}
        <Route path="/notifications" element={<NotificationsCenterPage />} />

        {/* Detail Routes */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/series/:id" element={<SeriesDetailPage />} />
        <Route path="/series/:id/season/:seasonId/episode/:episodeId" element={<EpisodeDetailPage />} />
        <Route path="/actor/:id" element={<ActorDetailPage />} />
        <Route path="/genre/:id" element={<GenreDetailPage />} />
        <Route path="/award/:id" element={<AwardDetailPage />} />
        <Route path="/review/:id" element={<ReviewDetailPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/collection/:id" element={<CollectionDetailPage />} />
        <Route path="/user/:id" element={<UserProfilePage />} />

        {/* Search */}
        <Route path="/search" element={<SearchPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup-complete" element={<SignupCompletePage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/two-factor" element={<TwoFactorPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="watchlist" element={<DashboardWatchlist />} />
          <Route path="favorites" element={<DashboardFavorites />} />
          <Route path="history" element={<DashboardHistory />} />
          <Route path="ratings" element={<DashboardRatings />} />
          <Route path="reviews" element={<DashboardReviews />} />
          <Route path="comments" element={<DashboardComments />} />
          <Route path="followers" element={<DashboardFollowers />} />
          <Route path="following" element={<DashboardFollowing />} />
          <Route path="lists" element={<DashboardLists />} />
          <Route path="recommendations" element={<DashboardRecommendations />} />
          <Route path="notifications" element={<DashboardNotifications />} />
          <Route path="messages" element={<DashboardMessages />} />
          <Route path="privacy" element={<DashboardPrivacy />} />
          <Route path="security" element={<DashboardSecurity />} />
          <Route path="billing" element={<DashboardBilling />} />
          <Route path="vip" element={<DashboardVIP />} />
          <Route path="help" element={<DashboardHelp />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="profile/edit" element={<DashboardEditProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="series" element={<AdminSeries />} />
          <Route path="people" element={<AdminPeople />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
