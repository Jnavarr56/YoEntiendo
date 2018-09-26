class UsersController < ApplicationController
    before_action :authenticate_user!
    

    def index
        @user = current_user


        #puts user_params
        
        #if user_params[:id].to_i != current_user.id.to_i
            #redirect_back fallback_location: '/'
        #end


        #@user = User.find(user_params[:id])

        
    end

    private
    
    def user_params
        
    end

end
