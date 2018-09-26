require './lib/basic_module.rb'

class PassagesController < ApplicationController
  include BasicModule

  before_action :authenticate_user!
  before_action :set_passage, only: [:show, :edit, :update, :destroy]


  # GET /passages
  # GET /passages.json
  def index
    #==================================================================
    #GET A COMBINATION OF THE PASSAGES THE USER HAS CREATED AND PASSAGES SHARED WITH USER THAT HAVE BEEN OPENED
    authored_passages = Passage.where(user_id: current_user.id)
    if !authored_passages
      authored_passages = []
    end
    
    passages_shares_recieved = PassageShare.where({recieving_user_id: current_user.id, opened: true})
    if passages_shares_recieved 
      passages_shares_recieved_by_id = passages_shares_recieved.collect { |share| share.passage_id }
      passages_recieved = Passage.where(id: passages_shares_recieved_by_id)  
      @total_passages = authored_passages + passages_recieved
    else
      @total_passages = authored_passages
    end
    #==================================================================
    
    #==================================================================
    #GET TIME OF LAST UPDATE AND LAST USER THAT UPDATED THE PASSAGE
    @users_affilation = {}
    @update_history = {}
    @total_passages.each do |passage|

      @update_history[passage.id] = UpdateTrack.where(passage_id: passage.id).order("created_at DESC").first
      @users_affilation[passage.id] = User.find(@update_history[passage.id].last_user_id)
    end
    #==================================================================
  end

  # GET /passages/1
  # GET /passages/1.json
  def show

    @all_annotation_string = ''
    Annotation.where(passage_id: @passage.id).each do |annot|
      @all_annotation_string = @all_annotation_string + "#{annot.element}@-@#{annot.original_spanish}@-@#{annot.annotation_content}$-$"
    end
    @all_annotation_string = @all_annotation_string.gsub(/\R+/, ' ')


    #==================================================================
    #DO NOT ALLOW TO READ IF NOT GRANTED PRIVILEGE
    #DO NOT LINK TO EDIT IF NOT GRANTED PRIVILEGE
    privilege = PassageShare.find_by(recieving_user_id: @current_user.id, passage_id: @passage.id)


    if (@passage.user_id == @current_user.id)
      author = true
    else
      author = false
    end

    if author || privilege
    else 
      redirect_back fallback_location: '/'
    end

    if author || privilege.edit_privilege
      @has_editing_privilege = true
    else 
      @has_editing_privilege = false
    end
    #==================================================================

    #==================================================================
    #RETRIEVE AUTHOR OF CURRENT PASSAGE
    if author
      @author = @current_user
    else
      @author = User.find(@passage.user_id)
    end
    #==================================================================

    #==================================================================
    #RETRIEVE HISTORY OF UPDATES FOR CURRENT PASSAGE AND USERS THAT MADE THEM
    @update_history = UpdateTrack.where(passage_id: @passage.id).order("created_at DESC")
    @participating_users = {}
    @time_since = {}
    @update_history.each do |update|
      @time_since[update.id] = update_elapse_count(update[:created_at])
      @participating_users[update.id] = User.find(update.last_user_id)
    end     
    #==================================================================
  end

  # GET /passages/new
  def new
    @isCreation = true
    @current_user = current_user
    @passage = Passage.new
  end

  # GET /passages/1/edit
  def edit
    @isCreation = false
    #==================================================================
    #DO NOT ALLOW TO EDIT IF NOT GRANTED PRIVILEGE
    privilege = PassageShare.find_by({ recieving_user_id: @current_user.id, passage_id: @passage.id, edit_privilege: true })

    if (@passage.user_id == @current_user.id) || privilege
    else 
      redirect_back fallback_location: '/'
    end
    #==================================================================

    

  end

  # POST /passages
  # POST /passages.json
  def create
    @isCreation = true
    @current_user = current_user
    @passage = Passage.new(passage_params.except(:annotation_code))

    puts "-------"
    puts "-------"
    puts "-------"
    puts @isCreation
    puts "-------"

    respond_to do |format|
      if @passage.save
        @proceed = true
        format.html { redirect_to @passage, notice: 'Passage was successfully created.' }
        format.json { render :show, status: :created, location: @passage }
      else
        format.html { render :new }
        format.json { render json: @passage.errors, status: :unprocessable_entity }
      end
    end

    #==================================================================
    #CREATE FIRST UPDATE RECORD AND ANNOTATION RECORDS
    if @proceed
      UpdateTrack.create!(last_user_id: current_user.id, passage_id: @passage.id, nature: 'created passage', annotation_code: passage_params[:annotation_code], main_content: @passage.main_content)
      version_tracking = UpdateTrack.last.id 

      if passage_params[:annotation_code] != ''
        whole_annotation = passage_params[:annotation_code].split('$-$')
        whole_annotation.each do |annotation_whole|
          annotation_split_by_parts = annotation_whole.split('@-@')
          Annotation.create(passage_id: @passage.id, element: annotation_split_by_parts[0], original_spanish: annotation_split_by_parts[1], annotation_content: annotation_split_by_parts[2], made_by: current_user.id, in_update: version_tracking, main_content: @passage.content)
        end
      end
    end
    #==================================================================
  end

  # PATCH/PUT /passages/1
  # PATCH/PUT /passages/1.json
  def update
    @isCreation = false
    respond_to do |format|
      if @passage.update(passage_params.except(:annotation_code))
        @proceed = true
        format.html { redirect_to @passage, notice: 'Passage was successfully updated.' }
        format.json { render :show, status: :ok, location: @passage }
      else
        format.html { render :edit }
        format.json { render json: @passage.errors, status: :unprocessable_entity }
      end
    end

    if @proceed
      UpdateTrack.create!(last_user_id: current_user.id, passage_id: @passage.id, nature: 'edited passage', annotation_code: passage_params[:annotation_code], main_content: @passage.content)
    end
  end

  # DELETE /passages/1
  # DELETE /passages/1.json
  def destroy
    puts @passage.inspect
    @passage.destroy
    respond_to do |format|
      format.html { redirect_to passages_url, notice: 'Passage was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_passage
      @passage = Passage.find(params[:id])
      @current_user = current_user
    end

    def check_read_privilege
      was_granted_reading_privilege = PassageShare.where({ recieving_user_id: @current_user.id, passage_id: @passage.id })
      if (@passage.user_id == @current_user.id) || was_granted_reading_privilege
      else 
        redirect_back fallback_location: '/'
      end
    end

    def check_edit_privilege
      was_granted_editing_privilege = PassageShare.where({ recieving_user_id: @current_user.id, passage_id: @passage.id, edit_privilege: true })
      if (@passage.user_id == @current_user.id) || was_granted_editing_privilege
        @has_editing_privilege = true
      else 
        @has_editing_privilege = false
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def passage_params
      params.require(:passage).permit(:user_id, :title, :content, :annotation_code)
    end
end
