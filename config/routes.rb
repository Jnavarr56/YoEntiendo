Rails.application.routes.draw do
  
  resources :document_passages
  resources :documents
  resources :annotations, only: [:show, :edit, :update, :index]
  resources :passage_shares
  resources :passages

  
  get '/update_track/:id' => 'update_tracks#show'
  get '/user' => 'home#show'
  #devise_for :users, controllers: { confirmations: "confirmations", sessions: 'sessions' } 

  devise_for :users

  





  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  devise_scope :user do

    authenticated :user do
      root 'home#index', as: :authenticated_root
    end

    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root
    end
    
  end


end
